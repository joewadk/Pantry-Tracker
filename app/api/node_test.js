const path = require('path');
const dotenvPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: dotenvPath });
console.log("API Key:", process.env.OPENAI_API_KEY);
