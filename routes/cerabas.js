require('dotenv').config();
const axios = require('axios');

const url = "https://openrouter.ai/api/v1/chat/completions";
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

if (!CEREBRAS_API_KEY) {
    console.error('❌ Missing CEREBRAS_API_KEY in the .env file.');
    process.exit(1);
}

const headers = {
    "Authorization": `Bearer ${CEREBRAS_API_KEY}`,
    "Content-Type": "application/json"
};

async function chat(message = '') {
    const data = {
        model: 'meta-llama/llama-3.3-70b-instruct',
        provider: {
            only: ['Cerebras']
        },
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: message }
        ]
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data; 
    } catch (error) {
        
        if (error.response) {
            console.error('API Error:', error.response.data);
            throw new Error(`API Error: ${error.response.data.error?.message || 'Unknown error'}`);
        } else {
            throw new Error(`Request failed: ${error.message}`);
        }
    }
}

module.exports = chat;
