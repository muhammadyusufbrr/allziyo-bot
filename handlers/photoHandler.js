const axios = require('axios');
const backendService = require('../services/backendService');

module.exports = (bot) => {
    bot.on('photo', async (msg) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;

        // Userga "Kuting" deymiz
        const waitMsg = await bot.sendMessage(chatId, "🔄 Rasm yuklanmoqda, iltimos kuting...");

        try {
            // 1. Rasmni Telegram serveridan olish
            const photoId = msg.photo[msg.photo.length - 1].file_id;
            const fileLink = await bot.getFileLink(photoId);

            // 2. Rasmni oqim (stream) sifatida yuklab olish
            const imageStream = await axios({
                url: fileLink,
                method: 'GET',
                responseType: 'stream'
            });

            // 3. Backendga yuborish
            const result = await backendService.sendReview(telegramId, imageStream.data, msg.caption);

            if (result && result.success) {
                await bot.editMessageText("✅ Rasm Adminga yuborildi! Javobni kuting.", {
                    chat_id: chatId,
                    message_id: waitMsg.message_id
                });
            } else {
                throw new Error("Backend qabul qilmadi");
            }

        } catch (error) {
            console.error(error);
            await bot.editMessageText("❌ Xatolik yuz berdi. Iltimos qayta urinib ko'ring.", {
                chat_id: chatId,
                message_id: waitMsg.message_id
            });
        }
    });
};