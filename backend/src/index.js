/**
 * 🚀 Main server for the document classification system
 * 
 * This file configures and runs the Express server that:
 * 1. Receives documents (files or URLs)
 * 2. Processes them to extract text
 * 3. Classifies and summarizes them using AI
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { config, validateConfig } = require('./config');
const { processDocument } = require('./documentProcessor');
const { DocumentAgent } = require('./agents/documentAgent');
const { startTracing, trackNode, endTracing } = require('@handit.ai/node');
require('../handitService'); // Initialize Handit service

// Validate configuration on startup
validateConfig();

const app = express();

// 🔧 Middleware (functions that run on each request)
app.use(cors()); // Allow requests from other domains
app.use(express.json()); // Allow receiving JSON in requests

/**
 * 📁 Multer configuration to handle uploaded files
 * - Saves files in memory (faster for small files)
 * - Limits size according to configuration
 */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: config.maxFileSize,
    },
    fileFilter: (req, file, cb) => {
        // ✅ Validate that the file type is allowed
        if (config.allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.mimetype}`), false);
        }
    }
});



/**
 * 📄 Main endpoint: Process documents
 * 
 * Accepts:
 * - Uploaded files (multipart/form-data)
 * - Document URLs (JSON)
 */
app.post('/api/process-document', upload.single('document'), async (req, res) => {
    const startTime = Date.now();
    let tracingResponse = null;


    try {
        console.log('📨 New document processing request');

        // 🔍 Start Handit tracing session for the entire request
        tracingResponse = await startTracing({
            agentName: 'document_classification'
        });
        const executionId = tracingResponse.executionId;
        console.log('🔍 API Handit tracing started with ID:', executionId);

        // Initialize the document agent
        const documentAgent = new DocumentAgent(executionId);

        // Track API request start
        await trackNode({
            input: {
                hasFile: !!req.file,
                hasUrl: !!req.body.url,
                fileInfo: req.file ? {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                } : null,
                url: req.body.url || null
            },
            nodeName: 'api_request_start',
            agentName: 'document_classification',
            nodeType: 'tool',
            executionId
        });

        // ✅ Validate that a document or URL was sent
        if (!req.file && !req.body.url) {
            console.log('❌ Error: No document or URL provided');

            // Track validation error
            await trackNode({
                input: { hasFile: false, hasUrl: false },
                output: { error: 'No document or URL provided' },
                nodeName: 'api_validation_error',
                agentName: 'document_classification',
                nodeType: 'tool',
                executionId
            });

            // End tracing
            await endTracing({
                executionId,
                agentName: 'document_classification'
            });

            return res.status(400).json({
                error: 'You must send a file or a URL',
                hint: 'Use form-data with key "document" for files, or JSON with key "url" for URLs'
            });
        }

        let documentContent;
        let sourceInfo;

        // 📁 Process uploaded file
        if (req.file) {
            console.log(`📎 Processing file: ${req.file.originalname} (${req.file.mimetype})`);
            sourceInfo = {
                type: 'file',
                name: req.file.originalname,
                size: req.file.size,
                mimeType: req.file.mimetype
            };
            documentContent = await processDocument(req.file.buffer, req.file.mimetype, executionId);
        }
        // 🌐 Process URL
        else {
            console.log(`🌐 Processing URL: ${req.body.url}`);
            sourceInfo = {
                type: 'url',
                url: req.body.url
            };
            documentContent = await processDocument(req.body.url, null, executionId);
        }

        console.log(`📝 Text extracted: ${documentContent.length} characters`);

        // Track text extraction completion
        await trackNode({
            input: { sourceInfo },
            output: {
                extractedLength: documentContent.length,
                wordCount: documentContent.split(/\s+/).filter(word => word.length > 0).length
            },
            nodeName: 'text_extraction_complete',
            agentName: 'document_classification',
            nodeType: 'tool',
            executionId
        });

        // 🤖 Process with AI (classify and summarize)
        console.log('🤖 Sending to AI for classification and summary...');
        const result = await documentAgent.processDocument(documentContent);

        // ⏱️ Calculate processing time
        const processingTime = Date.now() - startTime;
        console.log(`✅ Document processed successfully in ${processingTime}ms`);

        const finalResult = {
            success: true,
            data: {
                classification: result.classification,
                summary: result.summary,
                metadata: {
                    ...result.metadata,
                    source: sourceInfo,
                    processing_time_ms: processingTime
                }
            }
        };

        // Track successful API completion
        await trackNode({
            input: {
                documentLength: documentContent.length,
                sourceInfo
            },
            output: {
                success: true,
                processingTimeMs: processingTime,
                classification: result.classification,
                summaryLength: JSON.stringify(result.summary).length
            },
            nodeName: 'api_request_complete',
            agentName: 'document_classification',
            nodeType: 'tool',
            executionId
        });

        // End tracing session
        await endTracing({
            executionId,
            agentName: 'document_classification'
        });
        console.log('✅ API Handit tracing completed successfully');

        // 📤 Send response
        res.json(finalResult);

    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error('❌ Error processing document:', error.message);

        // Track API error
        if (tracingResponse?.executionId) {
            try {
                await trackNode({
                    input: {
                        hasFile: !!req.file,
                        hasUrl: !!req.body.url,
                        errorMessage: error.message
                    },
                    output: {
                        error: error.message,
                        processingTimeMs: processingTime,
                        success: false
                    },
                    nodeName: 'api_request_error',
                    agentName: 'document_classification',
                    nodeType: 'tool',
                    executionId: tracingResponse.executionId
                });

                // End tracing session
                await endTracing({
                    executionId: tracingResponse.executionId,
                    agentName: 'document_classification'
                });
            } catch (trackingError) {
                console.error('❌ Error tracking API error with Handit:', trackingError.message);
            }
        }

        // 📤 Send descriptive error
        res.status(500).json({
            success: false,
            error: 'Error processing the document',
            details: error.message,
            processing_time_ms: processingTime,
            hint: 'Verify that the file is valid and that your OpenAI API key is configured'
        });
    }
});

/**
 * 🏥 Server health endpoint
 * Useful to verify that the server is running
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        handit_enabled: !!process.env.HANDIT_API_KEY
    });
});

/**
 * 📋 System information endpoint
 * Shows what file types the system accepts
 */
app.get('/api/info', (req, res) => {
    res.json({
        supportedFileTypes: config.allowedMimeTypes,
        maxFileSize: config.maxFileSize,
        maxFileSizeMB: Math.round(config.maxFileSize / 1024 / 1024),
        version: require('../package.json').version,
        features: {
            handit_observability: !!process.env.HANDIT_API_KEY,
            ai_classification: !!config.openaiApiKey,
            vision_ai_support: true,
            url_processing: true
        }
    });
});

/**
 * 🚀 Start the server
 */
app.listen(config.port, () => {
    console.log('🎉 Server started successfully!');
    console.log(`📡 URL: http://localhost:${config.port}`);
    console.log(`📄 Docs: http://localhost:${config.port}/api/info`);
    console.log(`🏥 Health: http://localhost:${config.port}/health`);
    console.log('📁 Supported file types:', config.allowedMimeTypes.length);
    console.log('🔍 Handit observability:', !!process.env.HANDIT_API_KEY ? '✅ Enabled' : '❌ Disabled');
}); 