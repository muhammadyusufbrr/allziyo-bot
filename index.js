require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = require('./config/api');

// ✅ Faqat shu ikkalasi qolishi kerak:
const startHandler = require('./handlers/startHandler');
const messageHandler = require('./handlers/messageHandler');

// ❌ Bularni O'CHIRIB TASHLANG (Chunki messageHandler bularni ishini o'zi qilyapti):
// const contactHandler = require('./handlers/contactHandler'); 
// const photoHandler = require('./handlers/photoHandler');

// Botni yaratish
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Xatoliklarni ushlash (Internet uzilib qolsa bot o'chmasligi uchun)
bot.on("polling_error", (err) => console.log("Polling Error:", err.code));

// Modullarni ishga tushirish
startHandler(bot);
messageHandler(bot);

// ❌ Bularni ham O'CHIRIB TASHLANG:
// contactHandler(bot);
// photoHandler(bot);

console.log('🚀 ALZIYO BOT (Modular) ishga tushdi!');