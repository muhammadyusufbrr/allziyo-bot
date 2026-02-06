require('dotenv').config();

module.exports = {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000/api',
    BOT_TOKEN: process.env.BOT_TOKEN
};