const keyboards = require('../keyboards/menus');
const backendService = require('../services/backendService');

module.exports = (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        
        // Userni saqlash
        await backendService.saveUser({
            telegramId: msg.from.id,
            firstName: msg.from.first_name,
            username: msg.from.username
        });

        const promos = await backendService.getPromos();
        const promoCode = promos.welcomePromo; 

        await bot.sendMessage(chatId, 
            `Assalomu alaykum! 👋\nBotimizga xush kelibsiz!\n\n` +
            `Bizni tanlaganingiz uchun sizga sovg'a tariqasida **5% lik** maxsus promokod:\n\n` +
            `\`${promoCode}\`\n\n` +
            `_👆 Nusxa olish uchun kod ustiga bosing._\n\n` +
            `➖➖➖➖➖➖➖➖\n\n` + 
            `Здравствуйте! 👋\nДобро пожаловать в наш бот!\n\n` +
            `В качестве подарка за то, что выбрали нас, дарим вам специальный промокод на **5%**:\n\n` +
            `\`${promoCode}\`\n\n` +
            `_👆 Нажмите на код, чтобы скопировать._`, 
            { parse_mode: 'Markdown' }
        );

        await bot.sendMessage(chatId, "Iltimos, xizmat ko'rsatish tilini tanlang:\nПожалуйста, выберите язык обслуживания:", keyboards.languageKeyboard);
    });
};