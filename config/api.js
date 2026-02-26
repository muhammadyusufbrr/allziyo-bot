require('dotenv').config();

module.exports = {
    BACKEND_URL: process.env.BACKEND_URL || 'https://api.allziyo.uz/api',
    BOT_TOKEN: process.env.BOT_TOKEN
};