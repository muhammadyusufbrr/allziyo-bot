const keyboards = require('../keyboards/menus');
const backendService = require('../services/backendService');

module.exports = (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        
        try {
            // Userni saqlash
            await backendService.saveUser({
                telegramId: msg.from.id,
                firstName: msg.from.first_name,
                username: msg.from.username
            });

            const promos = await backendService.getPromos();
            
            // 🔥 O'ZGARISH 1: Kodni va Foizni alohida olamiz   
            const promoCode = promos.welcomePromo.code; 
            const promoPercent = promos.welcomePromo.percent; 

            await bot.sendMessage(chatId, 
                `Assalomu alaykum! 👋\nBotimizga xush kelibsiz!\n\n` +
                `Bizni tanlaganingiz uchun sizga maxsus sovg'a:\n\n` +
                `🔥 **${promoPercent}% CHEGIRMA** 🔥\n\n` +
                `Sizning promokodingiz:\n` +
                `👉 \`${promoCode}\` 👈\n\n` +
                `_Nusxa olish uchun kod ustiga bosing._\n\n` +
                `➖➖➖➖➖➖➖➖\n\n` + 
                `Здравствуйте! 👋\nДобро пожаловать в наш бот!\n\n` +
                `В качестве подарка за то, что выбрали нас, дарим вам:\n\n` +
                `🔥 **СКИДКУ ${promoPercent}%** 🔥\n\n` +
                `Ваш промокод:\n` +
                `👉 \`${promoCode}\` 👈\n\n` +
                `_Нажмите на код, чтобы скопировать._`, 
                { parse_mode: 'Markdown' }
            );
            await bot.sendMessage(chatId, "Iltimos, xizmat ko'rsatish tilini tanlang:\nПожалуйста, выберите язык обслуживания:", keyboards.languageKeyboard);
            
        } catch (error) {
            // 🔥 AGAR USER BOTNI BLOKLAGAN BO'LSA, SERVER QULAMAYDI
            if (error.response && error.response.body && error.response.body.error_code === 403) {
                console.log(`[XABAR] Foydalanuvchi ${chatId} botni bloklagan. Start xabari yuborilmadi.`);
            } else {
                console.error("[XATO] Start komandasida xatolik:", error.message);
            }
        }
    });
};