/**
 * 📄 DocumentProcessor - Text extractor for multiple formats
 * 
 * This module is responsible for extracting text from different types of documents:
 * - PDFs (using pdf-parse)
 * - Images (using GPT-4o-mini Vision for intelligent text extraction and description)
 * - Word documents (using mammoth)
 * - Excel/CSV spreadsheets (using xlsx)
 * - Plain text files
 * - Remote URLs (download and process)
 */

const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const { trackNode } = require('@handit.ai/node');
const OpenAI = require('openai');
const { config } = require('./config');
require('../handitService'); // Initialize Handit service

// Initialize OpenAI client for vision processing
const openai = new OpenAI({
    apiKey: config.openaiApiKey
});

/**
 * 🖼️ Process image using GPT-4o-mini vision capabilities
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mimeType - MIME type of the image
 * @param {string} executionId - Tracing session ID (optional)
 * @returns {string} Extracted text and description from image
 */
async function processImageWithVision(base64Image, mimeType, executionId = null) {
    try {
        console.log('🔍 Sending image to GPT-4o-mini for vision analysis...');
        
        const response = await openai.chat.completions.create({
            model: config.openai.model, // gpt-4o-mini
            messages: [
                {
                    role: "system",
                    content: "You are an expert in image analysis and text extraction. Your job is to analyze images and extract ALL the text you can see, or describe the visual content in detail if there is no text. Respond in the language of the text found (Spanish or English). If it is an invoice, receipt, document, letter, etc., extract all important data such as dates, numbers, names, etc. Be precise and complete in your analysis."
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            temperature: config.openai.temperature,
            max_tokens: 2000
        });

        const extractedContent = response.choices[0].message.content;
        console.log('✅ Vision analysis completed successfully');

        // Track vision processing with Handit
        if (executionId) {
            await trackNode({
                input: { 
                    imageSize: base64Image.length,
                    mimeType,
                    model: config.openai.model
                },
                output: { 
                    extractedContent: extractedContent.substring(0, 500) + '...',
                    contentLength: extractedContent.length,
                    tokensUsed: response.usage?.total_tokens || 0
                },
                nodeName: 'gpt4o_vision_analysis',
                agentName: 'document_classification',
                nodeType: 'llm',
                executionId
            });
        }

        return extractedContent;
        
    } catch (error) {
        console.error('❌ Error in vision processing:', error.message);
        
        // Track vision error
        if (executionId) {
            await trackNode({
                input: { imageSize: base64Image.length, mimeType },
                output: { error: error.message },
                nodeName: 'gpt4o_vision_error',
                agentName: 'document_classification',
                nodeType: 'llm',
                executionId
            });
        }
        
        throw new Error(`Vision processing failed: ${error.message}`);
    }
}

/**
 * 🔧 Main function to process any type of document
 * @param {Buffer|string} input - File as buffer or URL as string
 * @param {string} mimeType - MIME type of the file (optional)
 * @param {string} executionId - Tracing session ID (optional)
 * @returns {string} Text extracted from the document
 */
async function processDocument(input, mimeType = null, executionId = null) {
    try {
        console.log('📄 Starting document processing...');
        
        let content;
        let extractedText = '';
        let processingMethod = '';

        // 🌐 If input is a URL, download the file
        if (typeof input === 'string' && input.startsWith('http')) {
            console.log(`🌐 Downloading document from URL: ${input}`);
            
            try {
                const response = await axios.get(input, {
                    responseType: 'arraybuffer',
                    timeout: 30000, // 30 seconds timeout
                    maxContentLength: 50 * 1024 * 1024, // Maximum 50MB
                });
                
                content = response.data;
                mimeType = response.headers['content-type'] || mimeType;
                console.log(`✅ Download completed. Type: ${mimeType}, Size: ${content.length} bytes`);

                // 🔍 Track URL download with Handit if executionId is provided
                if (executionId) {
                    await trackNode({
                        input: { url: input, expectedType: mimeType },
                        output: { 
                            downloadedSize: content.length, 
                            detectedMimeType: mimeType,
                            downloadTime: Date.now()
                        },
                        nodeName: 'download_from_url',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
            } catch (downloadError) {
                console.error('❌ Error downloading from URL:', downloadError.message);
                
                // Track download error
                if (executionId) {
                    await trackNode({
                        input: { url: input },
                        output: { error: downloadError.message },
                        nodeName: 'download_from_url_error',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
                
                throw new Error(`Could not download the document from URL: ${downloadError.message}`);
            }
        } else {
            // 📁 Input is a file buffer
            content = input;
            console.log(`📁 Processing local file. Size: ${content.length} bytes`);
        }

        // 🔍 Process according to MIME type
        if (mimeType) {
            console.log(`🔍 Processing file of type: ${mimeType}`);
            
            if (mimeType.includes('pdf')) {
                // 📊 Process PDF
                processingMethod = 'PDF Parser';
                console.log('📊 Extracting text from PDF...');
                const startTime = Date.now();
                const pdfData = await pdfParse(content);
                extractedText = pdfData.text;
                const processingTime = Date.now() - startTime;
                console.log(`✅ PDF processed: ${pdfData.numpages} pages, ${extractedText.length} characters`);
                
                // Track PDF processing
                if (executionId) {
                    await trackNode({
                        input: { mimeType, fileSize: content.length },
                        output: { 
                            extractedText: extractedText.substring(0, 500) + '...',
                            pages: pdfData.numpages, 
                            charactersExtracted: extractedText.length,
                            processingTimeMs: processingTime,
                            method: processingMethod
                        },
                        nodeName: 'extract_text_pdf',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
                
            } else if (mimeType.includes('image')) {
                // 🖼️ Process image with GPT-4o-mini vision
                processingMethod = 'GPT-4o-mini Vision';
                console.log('🖼️ Processing image with GPT-4o-mini vision...');
                
                const startTime = Date.now();
                try {
                    // Convert buffer to base64 for OpenAI API
                    const base64Image = content.toString('base64');
                    extractedText = await processImageWithVision(base64Image, mimeType, executionId);
                    const processingTime = Date.now() - startTime;
                    console.log(`✅ Vision processing completed: ${extractedText.length} characters`);

                    // Track vision processing
                    if (executionId) {
                        await trackNode({
                            input: { mimeType, fileSize: content.length },
                            output: { 
                                extractedText: extractedText.substring(0, 500) + '...',
                                charactersExtracted: extractedText.length,
                                processingTimeMs: processingTime,
                                method: processingMethod
                            },
                            nodeName: 'extract_text_vision',
                            agentName: 'document_classification',
                            nodeType: 'tool',
                            executionId
                        });
                    }
                } catch (visionError) {
                    console.error('❌ Error with vision processing:', visionError.message);
                    throw new Error(`Could not process image with vision: ${visionError.message}`);
                }
                
            } else if (mimeType.includes('word') || mimeType.includes('docx')) {
                // 📝 Process Word document
                processingMethod = 'Word Document Parser';
                console.log('📝 Extracting text from Word document...');
                const startTime = Date.now();
                const result = await mammoth.extractRawText({ buffer: content });
                extractedText = result.value;
                const processingTime = Date.now() - startTime;
                console.log(`✅ Word document processed: ${extractedText.length} characters`);
                
                // Track Word processing
                if (executionId) {
                    await trackNode({
                        input: { mimeType, fileSize: content.length },
                        output: { 
                            extractedText: extractedText.substring(0, 500) + '...',
                            charactersExtracted: extractedText.length,
                            processingTimeMs: processingTime,
                            method: processingMethod
                        },
                        nodeName: 'extract_text_word',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
                
            } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
                // 📈 Process Excel spreadsheet
                processingMethod = 'Excel Parser';
                console.log('📈 Extracting text from spreadsheet...');
                const startTime = Date.now();
                const workbook = xlsx.read(content, { type: 'buffer' });
                const sheetNames = workbook.SheetNames;
                
                extractedText = sheetNames.map((sheetName, index) => {
                    const sheet = workbook.Sheets[sheetName];
                    const sheetText = xlsx.utils.sheet_to_csv(sheet);
                    console.log(`📋 Sheet ${index + 1}/${sheetNames.length} (${sheetName}): ${sheetText.length} characters`);
                    return `--- Sheet: ${sheetName} ---\n${sheetText}`;
                }).join('\n\n');
                
                const processingTime = Date.now() - startTime;
                console.log(`✅ Excel processed: ${sheetNames.length} sheets, ${extractedText.length} characters`);
                
                // Track Excel processing
                if (executionId) {
                    await trackNode({
                        input: { mimeType, fileSize: content.length, sheets: sheetNames.length },
                        output: { 
                            extractedText: extractedText.substring(0, 500) + '...',
                            sheetsProcessed: sheetNames.length,
                            charactersExtracted: extractedText.length,
                            processingTimeMs: processingTime,
                            method: processingMethod,
                            sheetNames
                        },
                        nodeName: 'extract_text_excel',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
                
            } else if (mimeType.includes('csv')) {
                // 📊 Process CSV file
                processingMethod = 'CSV Parser';
                console.log('📊 Processing CSV file...');
                const startTime = Date.now();
                
                // Try to parse as CSV
                try {
                    const workbook = xlsx.read(content, { type: 'buffer' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    extractedText = xlsx.utils.sheet_to_csv(firstSheet);
                } catch (csvError) {
                    // If xlsx fails, try as plain text
                    console.log('⚠️ XLSX parser failed, trying as plain text...');
                    extractedText = content.toString('utf-8');
                }
                
                const processingTime = Date.now() - startTime;
                console.log(`✅ CSV processed: ${extractedText.length} characters`);
                
                // Track CSV processing
                if (executionId) {
                    await trackNode({
                        input: { mimeType, fileSize: content.length },
                        output: { 
                            extractedText: extractedText.substring(0, 500) + '...',
                            charactersExtracted: extractedText.length,
                            processingTimeMs: processingTime,
                            method: processingMethod
                        },
                        nodeName: 'extract_text_csv',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
                
            } else if (mimeType.includes('text') || mimeType.includes('plain')) {
                // 📄 Process plain text
                processingMethod = 'Text Parser';
                console.log('📄 Processing plain text file...');
                const startTime = Date.now();
                    extractedText = content.toString('utf-8');
                const processingTime = Date.now() - startTime;
                console.log(`✅ Text processed: ${extractedText.length} characters`);
                
                // Track text processing
                if (executionId) {
                    await trackNode({
                        input: { mimeType, fileSize: content.length },
                        output: { 
                            extractedText: extractedText.substring(0, 500) + '...',
                            charactersExtracted: extractedText.length,
                            processingTimeMs: processingTime,
                            method: processingMethod
                        },
                        nodeName: 'extract_text_plain',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
                
            } else {
                throw new Error(`Unsupported file type: ${mimeType}`);
                }
        } else {
            // 🔍 Try to detect format if no MIME type
            console.log('🔍 No MIME type provided, attempting automatic detection...');
            
            // Try as text first
            try {
                extractedText = content.toString('utf-8');
                processingMethod = 'Automatic Text Detection';
                console.log(`✅ Detected as text: ${extractedText.length} characters`);
                
                // Track automatic detection
                if (executionId) {
                    await trackNode({
                        input: { fileSize: content.length, detectionAttempt: 'text' },
                        output: { 
                            extractedText: extractedText.substring(0, 500) + '...',
                            charactersExtracted: extractedText.length,
                            method: processingMethod
                        },
                        nodeName: 'extract_text_auto_detect',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId
                    });
                }
            } catch (error) {
                throw new Error('Could not determine document format and failed to read as text');
            }
        }

        // 🧹 Clean and validate extracted text
        extractedText = extractedText.trim();
        
        if (!extractedText || extractedText.length === 0) {
            console.log('⚠️ No text was extracted from the document');
            
            // Track empty extraction
            if (executionId) {
                await trackNode({
                    input: { mimeType, fileSize: content.length },
                    output: { 
                        extractedText: '',
                        charactersExtracted: 0,
                        warning: 'No text extracted'
                    },
                    nodeName: 'extract_text_empty',
                    agentName: 'document_classification',
                    nodeType: 'tool',
                    executionId
                });
            }
            
            throw new Error('No text could be extracted from the document. Please verify the file is valid and contains readable text.');
        }

        console.log(`✅ Document processing completed successfully using ${processingMethod}`);
        console.log(`📊 Final result: ${extractedText.length} characters extracted`);

        return extractedText;
        
    } catch (error) {
        console.error('❌ Error in document processing:', error.message);
        
        // Track processing error
        if (executionId) {
            await trackNode({
                input: { 
                    inputType: typeof input,
                    mimeType,
                    inputSize: typeof input === 'string' ? input.length : (input?.length || 0)
                },
                output: { 
                    error: error.message,
                    success: false
                },
                nodeName: 'document_processing_error',
                agentName: 'document_classification',
                nodeType: 'tool',
                executionId
            });
        }
        
        throw error;
    }
}

/**
 * 🚀 Additional utility functions
 */

/**
 * Validates if a MIME type is supported
 * @param {string} mimeType - MIME type to validate
 * @returns {boolean} True if supported
 */
function isSupportedMimeType(mimeType) {
    const supportedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'text/plain'
    ];
    
    return supportedTypes.some(type => mimeType?.includes(type));
}

/**
 * Gets the appropriate processing method for a MIME type
 * @param {string} mimeType - MIME type
 * @returns {string} Processing method name
 */
function getProcessingMethod(mimeType) {
    if (mimeType?.includes('pdf')) return 'PDF Parser';
    if (mimeType?.includes('image')) return 'GPT-4o-mini Vision';
    if (mimeType?.includes('word') || mimeType?.includes('docx')) return 'Word Document Parser';
    if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return 'Excel Parser';
    if (mimeType?.includes('csv')) return 'CSV Parser';
    if (mimeType?.includes('text') || mimeType?.includes('plain')) return 'Text Parser';
    return 'Unknown';
}

/**
 * Estimates processing time based on file size and type
 * @param {number} fileSize - File size in bytes
 * @param {string} mimeType - MIME type
 * @returns {number} Estimated time in milliseconds
 */
function estimateProcessingTime(fileSize, mimeType) {
    const baseTimes = {
        'pdf': 100, // ms per KB
        'image': 200, // ms per KB (GPT-4o-mini Vision is faster than OCR)
        'word': 50, // ms per KB
        'excel': 75, // ms per KB
        'csv': 25, // ms per KB
        'text': 10 // ms per KB
    };
    
    const fileSizeKB = fileSize / 1024;
    let timePerKB = baseTimes.text; // default
    
    for (const [type, time] of Object.entries(baseTimes)) {
        if (mimeType?.includes(type)) {
            timePerKB = time;
            break;
        }
    }
    
    return Math.round(fileSizeKB * timePerKB);
}

module.exports = {
    processDocument,
    isSupportedMimeType,
    getProcessingMethod,
    estimateProcessingTime
}; 