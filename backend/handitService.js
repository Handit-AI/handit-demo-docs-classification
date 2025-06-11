/**
 * Handit.ai service initialization.
 */
const { config } = require('@handit.ai/node');
const dotenv = require('dotenv');

dotenv.config();
 
// Configure Handit.ai with your API key
config({ 
    apiKey: process.env.HANDIT_API_KEY  // Sets up authentication for Handit.ai services
});

console.log('🔍 Handit.ai service initialized');