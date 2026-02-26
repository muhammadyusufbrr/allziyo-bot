const keyboards = require("../keyboards/menus");
const axios = require("axios");
const backendService = require("../services/backendService");
const BACKEND_URL = process.env.BACKEND_URL || "https://api.allziyo.uz/api";

const userLangs = {}; 
const userSteps = {}; 

module.exports = (bot) => {
  const handleRegistration = async (chatId, userId, phoneNumber, firstName) => {
    try {
      await backendService.saveUser({
        telegramId: userId,
        phoneNumber: phoneNumber,
        firstName: firstName,
      });

      // 🔥 Backenddan kelgan promokod obyektlarini qabul qilamiz
      const promos = await backendService.getPromos();
      
      // Ro'yxatdan o'tganlarga (kontakt ulashganlarga) atalgan promokod va uning foizini olamiz
      const promoCode = promos.registerPromo.code; 
      const promoPercent = promos.registerPromo.percent; // 🔥 Dinamik foiz
      
      const lang = userLangs[chatId] || "uz";
      userSteps[chatId] = 'MAIN_MENU';

      if (lang === "ru") {
          await bot.sendMessage(
            chatId,
            `Спасибо! ✅ Вы успешно зарегистрировались.\n\n` +
            `Ваш новый подарок:\n\n` +
            `🎁 **СКИДКА ${promoPercent}%** 🎁\n\n` +
            `Ваш промокод:\n` +
            `👉 \`${promoCode}\` 👈\n\n` +
            `_Нажмите на код, чтобы скопировать._`,
            { parse_mode: "Markdown" }
          );
          await bot.sendMessage(chatId, "Пожалуйста, выберите один из следующих разделов:", keyboards.mainMenuRu);
      } else {
          await bot.sendMessage(
            chatId,
            `Rahmat! ✅ Ro'yxatdan muvaffaqiyatli o'tdingiz.\n\n` +
            `Sizning yangi sovg'angiz:\n\n` +
            `🎁 **${promoPercent}% CHEGIRMA** 🎁\n\n` +
            `Promokod:\n` +
            `👉 \`${promoCode}\` 👈\n\n` +
            `_Nusxa olish uchun kod ustiga bosing._`,
            { parse_mode: "Markdown" }
          );
          await bot.sendMessage(chatId, "Marhamat, quyidagi bo'limlardan birini tanlang:", keyboards.mainMenu);
      }
    } catch (error) {
      console.log("Registratsiya xatosi:", error.message);
      const lang = userLangs[chatId] || "uz";
      const errText = lang === "ru" ? "Произошла ошибка. Пожалуйста, попробуйте позже." : "Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.";
      await bot.sendMessage(chatId, errText);
    }
  };

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const photo = msg.photo;
    const contact = msg.contact;

    try {
        if (text === "⬅️ Orqaga" || text === "⬅️ Назад") {
            const step = userSteps[chatId];
            const lang = userLangs[chatId] || "uz";
            const isRu = lang === "ru";

            if (step === 'ACTION') {
                userSteps[chatId] = 'MAIN_MENU';
                const replyText = isRu ? "Возврат в главное меню:" : "Bosh menyuga qaytildi:";
                await bot.sendMessage(chatId, replyText, isRu ? keyboards.mainMenuRu : keyboards.mainMenu);
            } 
            else if (step === 'MAIN_MENU') {
                userSteps[chatId] = 'PHONE_PROMPT';
                const replyText = isRu ? "Пожалуйста, отправьте ваш номер телефона:" : "Iltimos, telefon raqamingizni yuboring:";
                await bot.sendMessage(chatId, replyText, isRu ? keyboards.contactKeyboardRu : keyboards.contactKeyboard);
            } 
            else {
                userSteps[chatId] = 'LANG';
                await bot.sendMessage(chatId, "Iltimos, xizmat ko'rsatish tilini tanlang:\nПожалуйста, выберите язык обслуживания:", keyboards.languageKeyboard);
            }
            return;
        }

        // 🔥 KONTAKT YUBORILGANDA SHU YER ISHLAYDI
        if (contact) {
          let phone = contact.phone_number;
          if (!phone.startsWith("+")) phone = `+${phone}`;
          // Yuqoridagi handleRegistration funksiyasiga uzatadi
          await handleRegistration(chatId, msg.from.id, phone, contact.first_name);
          return;
        }

        const phoneRegex = /^\+998\d{9}$/;
        if (text && phoneRegex.test(text)) {
          await handleRegistration(chatId, msg.from.id, text, msg.from.first_name);
          return;
        }

        if (text && (text.startsWith("+998") || text.startsWith("998") || /^\d{9,12}$/.test(text))) {
          const lang = userLangs[chatId] || "uz";
          if (lang === "ru") {
              await bot.sendMessage(chatId, "⚠️ **Неверный формат номера!**\n\nПожалуйста, введите ваш номер полностью:\n\n`+998901234567`\n\nИли нажмите кнопку ниже:", { parse_mode: "Markdown", ...keyboards.contactKeyboardRu });
          } else {
              await bot.sendMessage(chatId, "⚠️ **Raqam formati noto'g'ri!**\n\nIltimos, raqamingizni quyidagi shaklda to'liq kiriting:\n\n`+998901234567`\n\nYoki pastdagi tugmani bosing:", { parse_mode: "Markdown", ...keyboards.contactKeyboard });
          }
          return;
        }

        if (msg.document || msg.video || msg.audio || msg.voice || msg.sticker || msg.animation || msg.location) {
          const lang = userLangs[chatId] || "uz";
          const errText = lang === "ru" ? "🚫 **Извините, этот формат не принимается!**\n\nПожалуйста, отправляйте только **ФОТО (Скриншот)** или **ТЕКСТ**." : "🚫 **Kechirasiz, bu format qabul qilinmaydi!**\n\nIltimos, faqat **RASM (Skrinshot)** yoki **MATN** yuboring.";
          await bot.sendMessage(chatId, errText, { parse_mode: "Markdown" });
          return;
        }
        
        if (photo) {
          const fileId = photo[photo.length - 1].file_id;
          await axios.post(`${BACKEND_URL}/chat/receive-from-bot`, {
            telegramId: chatId,
            text: msg.caption || "",
            fileId: fileId,
            type: "image",
          });
          
          const lang = userLangs[chatId] || "uz";
          const successText = lang === "ru" ? "Фото получено! ✅ Ожидайте ответа." : "Rasm qabul qilindi! ✅ Javobni kuting.";
          await bot.sendMessage(chatId, successText);
          return;
        }

        if (!text) return;
        
        if (text === "🇺🇿 O'zbek tili") {
          userLangs[chatId] = "uz";
          userSteps[chatId] = 'PHONE_PROMPT';
          await backendService.saveUser({ telegramId: msg.from.id, language: "uz" });
          await bot.sendMessage(
            chatId,
            "🎉 **Ajoyib! Endi ro'yxatdan o'tamiz.**\n\n🎁 Maxsus sovg'ani olish uchun telefon raqamingizni tasdiqlang.\n\nBuning uchun 2 ta yo'l bor:\n\n1️⃣ Pastdagi **📞 Raqamni yuborish** tugmasini bosing.\n\n2️⃣ Yoki raqamingizni quyidagi shaklda qo'lda yozib yuboring:\n\n`+998997674565`",
            { parse_mode: "Markdown", ...keyboards.contactKeyboard }
          );
        } 
        else if (text === "🇷🇺 Русский язык") {
          userLangs[chatId] = "ru";
          userSteps[chatId] = 'PHONE_PROMPT';
          await backendService.saveUser({ telegramId: msg.from.id, language: "ru" });
          await bot.sendMessage(
            chatId,
            "🎉 **Отлично! Теперь пройдем регистрацию.**\n\n🎁 Чтобы получить подарок, подтвердите свой номер телефона.\n\nЕсть 2 способа:\n\n1️⃣ Нажмите кнопку **📞 Отправить номер** внизу.\n\n2️⃣ Или введите номер вручную в формате:\n\n`+998997674565`",
            { parse_mode: "Markdown", ...keyboards.contactKeyboardRu }
          );
        }
        else if (text === "🎁 So'vg'a olish" || text === "🎁 Получить подарок") {
          userSteps[chatId] = 'ACTION';
          const isRu = text === "🎁 Получить подарок";
          const replyText = isRu ? "📸 **Пожалуйста, отправьте скриншот с комментарием...**" : "📸 **Iltimos, izoh yozilgan skrinshotni yuboring...**";
          const keyboard = isRu ? keyboards.backKeyboardRu : keyboards.backKeyboard;
          await bot.sendMessage(chatId, replyText, { parse_mode: "Markdown", ...keyboard });
        }
        else if (text === "❓ Savol yozish" || text === "❓ Задать вопрос") {
          userSteps[chatId] = 'ACTION';
          const isRu = text === "❓ Задать вопрос";
          const replyText = isRu ? "Напишите свой вопрос..." : "Savolingizni yozib qoldiring...";
          const keyboard = isRu ? keyboards.backKeyboardRu : keyboards.backKeyboard;
          await bot.sendMessage(chatId, replyText, keyboard);
        }
        else if (text === "/start") {
          userSteps[chatId] = 'LANG';
          return;
        }
        else {
          await axios.post(`${BACKEND_URL}/chat/receive-from-bot`, {
            telegramId: chatId,
            text: text,
            type: "text",
          });
        }

    } catch (error) {
        if (error.response && error.response.body && error.response.body.error_code === 403) {
            console.log(`[XABAR] Foydalanuvchi ${chatId} botni bloklagan.`);
        } else {
            console.error("[XATO] Message handlerda xatolik:", error.message);
        }
    }
  });
};