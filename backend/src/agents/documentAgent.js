/**
 * 🤖 DocumentAgent - Intelligent agent for classifying and summarizing documents
 * 
 * This agent uses OpenAI GPT-4o-mini to:
 * 1. Classify documents into predefined categories
 * 2. Create structured summaries of the content
 * 
 * It's like having an assistant that reads documents and tells you:
 * - What type of document is it?
 * - What is it about?
 * - What are the important points?
 */

const OpenAI = require('openai');
const { config } = require('../config');
const { trackNode, fetchOptimizedPrompt } = require('@handit.ai/node');
require('../../handitService'); // Initialize Handit service

class DocumentAgent {
    constructor(executionId) {
        // 🔧 Configure OpenAI client
        this.openai = new OpenAI({
            apiKey: config.openaiApiKey
        });

        this.executionId = executionId;
        
        console.log('🤖 DocumentAgent initialized successfully');
    }

    /**
     * 📄 Main method: processes a complete document
     * @param {string} documentContent - Extracted text from the document
     * @returns {Object} Result with classification and summary
     */
    async processDocument(documentContent) {
        let tracingResponse = null;
        
        try {
            console.log('🔄 Starting AI processing...');
            
            
            // ✅ Validate that content is not empty
            if (!documentContent || documentContent.trim().length === 0) {
                throw new Error('The document is empty or does not contain valid text');
            }

            // Track the main document processing start
            await trackNode({
                input: { 
                    documentContent: documentContent.substring(0, 500) + '...', 
                    contentLength: documentContent.length,
                    wordCount: documentContent.split(/\s+/).filter(word => word.length > 0).length
                },
                nodeName: 'processDocument_start',
                agentName: 'document_classification',
                nodeType: 'tool',
                executionId: this.executionId
            });

            // 📋 Execute classification and summary sequentially
            console.log('🔄 Running classification and summary sequentially...');
            console.log('🏷️ Step 1: Classifying document...');
            const classification = await this.classifyDocument(documentContent, this.executionId);
            console.log('📝 Step 2: Creating summary...');
            const summary = await this.summarizeDocument(documentContent, this.executionId);

            const result = {
                classification,
                summary,
                metadata: {
                    processed_at: new Date().toISOString(),
                    content_length: documentContent.length,
                    word_count: documentContent.split(/\s+/).filter(word => word.length > 0).length,
                    char_count: documentContent.length,
                    estimated_reading_time_minutes: Math.ceil(documentContent.split(/\s+/).length / 200) // ~200 words per minute
                }
            };

            // Track the successful completion
            await trackNode({
                input: { 
                    documentContent: documentContent.substring(0, 500) + '...', 
                    contentLength: documentContent.length 
                },
                output: {
                    classification: result.classification,
                    summary: result.summary,
                    metadata: result.metadata
                },
                nodeName: 'processDocument_complete',
                agentName: 'document_classification',
                nodeType: 'tool',
                executionId: this.executionId
            });

            console.log('✅ Processing completed successfully');

            return result;
            
        } catch (error) {
            console.error('❌ Error in DocumentAgent:', error.message);
            
            // Track the error if we have an execution ID
            if (tracingResponse?.executionId) {
                try {
                    await trackNode({
                        input: { documentContent: documentContent?.substring(0, 500) + '...' },
                        output: { error: error.message },
                        nodeName: 'processDocument_error',
                        agentName: 'document_classification',
                        nodeType: 'tool',
                        executionId: tracingResponse.executionId
                    });

                } catch (trackingError) {
                    console.error('❌ Error tracking with Handit:', trackingError.message);
                }
            }
            
            // 🔍 Provide more specific errors
            if (error.message.includes('API key')) {
                throw new Error('Error with OpenAI API key. Verify that it is configured correctly.');
            } else if (error.message.includes('quota')) {
                throw new Error('You have reached your OpenAI account limit. Check your balance.');
            } else if (error.message.includes('rate limit')) {
                throw new Error('Too many requests too fast. Wait a moment and try again.');
            }
            
            throw new Error(`Error processing document: ${error.message}`);
        }
    }

    /**
     * 🏷️ Classify the document into predefined categories
     * @param {string} documentContent - Document text
     * @param {string} executionId - Tracing session ID
     * @returns {Object} Classification with category, confidence and explanation
     */
    async classifyDocument(documentContent, executionId) {
        // 📝 List of categories that the system can recognize
        const categories = [
            'Receipt/Invoice', 'Contract/NDA', 'Report/Document', 
            'Email/Letter', 'CV/Resume', 'Legal Document',
            'Medical Document', 'Financial Document', 'Presentation',
            'Spreadsheet', 'Technical Document', 'Manual/Guide', 'Other'
        ];

        // System prompt with all instructions
        const systemPrompt = `You are an expert in document classification. Your job is to analyze documents and classify them with precision.

AVAILABLE CATEGORIES:
${categories.map(cat => `- ${cat}`).join('\n')}

Instructions:
1. Read the document carefully
2. Identify the document type based on its content, structure and purpose
3. Assign the most appropriate category
4. Indicate your confidence level (high/medium/low)
5. Briefly explain why you chose that category

JSON RESPONSE:
{
    "category": "main category",
    "subcategory": "specific type if applicable",
    "confidence": "high/medium/low",
    "explanation": "brief explanation of why this is the category",
    "detected_language": "detected language",
    "keywords": ["word1", "word2", "word3"]
}

Always respond in valid JSON format.`;

        // User prompt with only the document content
        const userPrompt = documentContent.substring(0, 3000) + (documentContent.length > 3000 ? '...' : '');

        try {
            // 🔍 Fetch optimized prompt from Handit
            const optimizedSystemPrompt = await fetchOptimizedPrompt({
                modelId: 'classifyDocument',
            });

            console.log('🔍 Handit optimized prompt for classification:', optimizedSystemPrompt ? 'Found' : 'Using original');

            // Use optimized system prompt if available, otherwise use the original
            const bestSystemPrompt = optimizedSystemPrompt !== null && optimizedSystemPrompt !== undefined ? optimizedSystemPrompt : systemPrompt;

            // Structure the messages for better control
            const messages = [
                    {
                        role: "system",
                        content: bestSystemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
            ];

            const response = await this.openai.chat.completions.create({
                model: config.openai.model,
                messages: messages,
                temperature: config.openai.temperature,
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(response.choices[0].message.content);

            // 🔍 Track the classification operation with Handit
            await trackNode({
                input: {
                    messages,
                    documentLength: documentContent.length,
                    categories: categories.length
                },
                output: result,
                nodeName: 'classifyDocument',
                agentName: 'document_classification',
                nodeType: 'llm',
                executionId
            });

            return result;
        } catch (error) {
            console.error('❌ Error in classification:', error.message);
            
            // Track the error with Handit
            if (executionId) {
                await trackNode({
                    input: { systemPrompt, userPrompt, documentLength: documentContent.length },
                    output: { error: error.message },
                    nodeName: 'classifyDocument_error',
                    agentName: 'document_classification',
                    nodeType: 'llm',
                    executionId
                });
            }
            
            throw new Error(`Error classifying document: ${error.message}`);
        }
    }

    /**
     * 📋 Create a structured summary of the document
     * @param {string} documentContent - Document text
     * @param {string} executionId - Tracing session ID
     * @returns {Object} Summary with key points, important details and actions
     */
    async summarizeDocument(documentContent, executionId) {
        // System prompt with all instructions
        const systemPrompt = `You are an expert in document analysis and summarization. Your job is to create complete and structured summaries.

Instructions:
1. Identify the main purpose of the document
2. Extract the most important points
3. Identify relevant dates, numbers and figures
4. Identify people, companies or organizations mentioned
5. Identify any required actions or next steps
6. Create a concise but complete summary

JSON RESPONSE:
{
    "main_purpose": "main purpose of the document in one sentence",
    "key_points": ["important point 1", "important point 2", "important point 3"],
    "important_details": {
        "dates": ["date1", "date2"],
        "amounts": ["amount1", "amount2"],
        "parties": ["person/company1", "person/company2"],
        "locations": ["location1", "location2"]
    },
    "action_items": ["required action 1", "required action 2"],
    "summary": "concise summary of 2-3 sentences",
    "urgency_level": "low/medium/high",
    "requires_follow_up": true/false
}

Always respond in valid JSON format with structured and precise information.`;

        // User prompt with only the document content
        const userPrompt = documentContent.substring(0, 4000) + (documentContent.length > 4000 ? '...' : '');

        try {
            // 🔍 Fetch optimized prompt from Handit
            const optimizedSystemPrompt = await fetchOptimizedPrompt({
                modelId: 'summarizeDocument',
            });

            console.log('🔍 Handit optimized prompt for summarization:', optimizedSystemPrompt ? 'Found' : 'Using original');

            // Use optimized system prompt if available, otherwise use the original
            const bestSystemPrompt = optimizedSystemPrompt !== null && optimizedSystemPrompt !== undefined ? optimizedSystemPrompt : systemPrompt;

            // Structure the messages for better control
            const messages = [
                    {
                        role: "system",
                        content: bestSystemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
            ];

            const response = await this.openai.chat.completions.create({
                model: config.openai.model,
                messages: messages,
                temperature: config.openai.temperature,
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(response.choices[0].message.content);

            // 🔍 Track the summarization operation with Handit
            await trackNode({
                input: {
                    messages,
                    documentLength: documentContent.length
                },
                output: result,
                nodeName: 'summarizeDocument',
                agentName: 'document_classification',
                nodeType: 'llm',
                executionId
            });

            return result;
        } catch (error) {
            console.error('❌ Error in summary:', error.message);
            
            // Track the error with Handit
            if (executionId) {
                await trackNode({
                    input: { systemPrompt, userPrompt, documentLength: documentContent.length },
                    output: { error: error.message },
                    nodeName: 'summarizeDocument_error',
                    agentName: 'document_classification',
                    nodeType: 'llm',
                    executionId
                });
            }
            
            throw new Error(`Error summarizing document: ${error.message}`);
        }
    }
}

module.exports = {
    DocumentAgent
}; 