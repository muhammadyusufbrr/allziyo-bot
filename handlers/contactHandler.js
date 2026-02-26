const keyboards = require('../keyboards/menus');
const backendService = require('../services/backendService');

module.exports = (bot) => {
    bot.on('contact', async (msg) => {
        const chatId = msg.chat.id;
        const phoneNumber = msg.contact.phone_number;

        // 1. Telefon raqamni Backendga yuborib saqlaymiz
        await backendService.updatePhone(msg.from.id, phoneNumber);

        // 2. Backenddan sozlamalarni olib, 15% lik kodni ajratamiz
        const promos = await backendService.getPromos();
        const promoCode = promos.registerPromo; // Masalan: "SUPER15"

        // 3. Xabarni chiroyli snippet (nusxa olinadigan) formatda yuboramiz
        await bot.sendMessage(chatId, 
            `Rahmat! ✅ Ro'yxatdan muvaffaqiyatli o'tdingiz.\n\nSizga **10% lik** maxsus promokod:\n\n\`${promoCode}\`\n\n_👆 Nusxa olish uchun kod ustiga bosing._`, 
            { parse_mode: 'Markdown' }
        );

        // 4. Asosiy menyuni chiqaramiz
        await bot.sendMessage(chatId, "Marhamat, quyidagi bo'limlardan birini tanlang:", keyboards.mainMenu);
    });
};