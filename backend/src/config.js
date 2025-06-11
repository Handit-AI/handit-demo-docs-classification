/**
 * Central application configuration
 * All important configurations are in one place here
 */

// Load environment variables
require('dotenv').config();

// Server configuration
const config = {
    // Port where the server will run
    port: process.env.PORT || 3000,
    
    // OpenAI API Key (REQUIRED)
    openaiApiKey: process.env.OPENAI_API_KEY,
    
    // File configuration
    maxFileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB default
    
    // Allowed file types (for security)
    allowedMimeTypes: [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv',
        'application/csv', // Alternative CSV
        'application/octet-stream', // For files without specific type
        'text/plain'
    ],
    
    // OpenAI configuration
    openai: {
        model: 'gpt-4o-mini', // Model with vision capability to process images directly
        temperature: 0 // 0 = more consistent, 1 = more creative
    }
};

/**
 * Validate that required configurations are present
 */
function validateConfig() {
    if (!config.openaiApiKey) {
        console.error('❌ Error: OPENAI_API_KEY is not configured');
        console.log('💡 Solution:');
        console.log('1. Create a .env file in the project root');
        console.log('2. Add: OPENAI_API_KEY=your_api_key_here');
        console.log('3. Get your API key at: https://platform.openai.com/api-keys');
        process.exit(1);
    }
    
    console.log('✅ Configuration validated successfully');
}

module.exports = {
    config,
    validateConfig
}; 