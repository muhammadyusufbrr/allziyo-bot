const keyboards = require("../keyboards/menus");
const axios = require("axios");
const backendService = require("../services/backendService");
const BACKEND_URL = "http://localhost:5000/api";

module.exports = (bot) => {
  const handleRegistration = async (chatId, userId, phoneNumber, firstName) => {
    try {
      // 1. Bazaga saqlash
      await backendService.saveUser({
        telegramId: userId,
        phoneNumber: phoneNumber,
        firstName: firstName,
      });

     const promos = await backendService.getPromos()
      const promoCode = promos.registerPromo || "SUPER15";

      await bot.sendMessage(
        chatId,
        `Rahmat! ✅ Ro'yxatdan muvaffaqiyatli o'tdingiz.\n\nSizga **15% lik** maxsus promokod:\n\n\`${promoCode}\`\n\n_👆 Nusxa olish uchun kod ustiga bosing._`,
        { parse_mode: "Markdown" },
      );

      // 4. Asosiy menyu
      await bot.sendMessage(
        chatId,
        "Marhamat, quyidagi bo'limlardan birini tanlang:",
        keyboards.mainMenu,
      );
    } catch (error) {
      console.log("Registratsiya xatosi:", error.message);
      await bot.sendMessage(
        chatId,
        "Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.",
      );
    }
  };

  // 🔥 HAMMA XABARLARNI SHU YERDA USHLAYMIZ
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const photo = msg.photo;
    const contact = msg.contact;

    // ----------------------------------------------------
    // 1. TUGMA ORQALI KONTAKT KELSA (Share Contact)
    // ----------------------------------------------------
    if (contact) {
      // Kontakt ichida raqam + siesiz kelishi mumkin, oldiga + qo'shib qo'yamiz
      let phone = contact.phone_number;
      if (!phone.startsWith("+")) phone = `+${phone}`;

      await handleRegistration(chatId, msg.from.id, phone, contact.first_name);
      return; // 🛑 KOD SHU YERDA TO'XTAYDI (2-marta ishlamaydi)
    }

    // ----------------------------------------------------
    // 2. QO'LDA YOZILGAN RAQAMNI TEKSHIRISH (+998...)
    // ----------------------------------------------------
    const phoneRegex = /^\+998\d{9}$/;

    if (text && phoneRegex.test(text)) {
      await handleRegistration(chatId, msg.from.id, text, msg.from.first_name);
      return; // 🛑 BU YERDA HAM TO'XTAYDI
    }

    // ----------------------------------------------------
    // 3. QO'LDA YOZILGAN, LEKIN XATO FORMAT BO'LSA
    // ----------------------------------------------------
    if (
      text &&
      (text.startsWith("+998") || text.startsWith("998") || /^\d{9,12}$/.test(text))
    ) {
      await bot.sendMessage(
        chatId,
        "⚠️ **Raqam formati noto'g'ri!**\n\nIltimos, raqamingizni quyidagi shaklda to'liq kiriting:\n\n`+998901234567`\n\nYoki pastdagi tugmani bosing:",
        {
          parse_mode: "Markdown",
          ...keyboards.contactKeyboard, 
        },
      );
      return;
    }

    // ----------------------------------------------------
    // 4. TAQIQLANGAN FILTRLAR
    // ----------------------------------------------------
    if (
      msg.document || msg.video || msg.audio || msg.voice ||
      msg.sticker || msg.animation || msg.location
    ) {
      await bot.sendMessage(
        chatId,
        "🚫 **Kechirasiz, bu format qabul qilinmaydi!**\n\nIltimos, faqat **RASM (Skrinshot)** yoki **MATN** yuboring.",
        { parse_mode: "Markdown" },
      );
      return;
    }

    // ----------------------------------------------------
    // 5. AGAR RASM BO'LSA
    // ----------------------------------------------------
    if (photo) {
      try {
        const fileId = photo[photo.length - 1].file_id;
        await axios.post(`${BACKEND_URL}/chat/receive-from-bot`, {
          telegramId: chatId,
          text: msg.caption || "",
          fileId: fileId,
          type: "image",
        });
        await bot.sendMessage(chatId, "Rasm qabul qilindi! ✅ Javobni kuting.");
      } catch (error) {
        console.log("Rasm xatosi:", error.message);
      }
      return;
    }

    if (!text) return;

    // ----------------------------------------------------
    // 6. MENYU VA BUYRUQLAR (Chat va Menyular)
    // ----------------------------------------------------
    if (text === "🇺🇿 O'zbek tili") {
      await backendService.saveUser({ telegramId: msg.from.id, language: "uz" });
      await bot.sendMessage(
        chatId,
        "🎉 **Ajoyib! Endi ro'yxatdan o'tamiz.**\n\n🎁 Maxsus sovg'ani olish uchun telefon raqamingizni tasdiqlang.\n\nBuning uchun 2 ta yo'l bor:\n\n1️⃣ Pastdagi **📞 Raqamni yuborish** tugmasini bosing.\n\n2️⃣ Yoki raqamingizni quyidagi shaklda qo'lda yozib yuboring:\n\n`+998997674565`",
        { parse_mode: "Markdown", ...keyboards.contactKeyboard }
      );
    } 
    else if (text === "🇷🇺 Русский язык") {
      await backendService.saveUser({ telegramId: msg.from.id, language: "ru" });
      await bot.sendMessage(
        chatId,
        "🎉 **Отлично! Теперь пройдем регистрацию.**\n\n🎁 Чтобы получить подарок, подтвердите свой номер телефона.\n\nЕсть 2 способа:\n\n1️⃣ Нажмите кнопку **📞 Отправить номер** внизу.\n\n2️⃣ Или введите номер вручную в формате:\n\n`+998997674565`",
        { parse_mode: "Markdown", ...keyboards.contactKeyboard }
      );
    }
    else if (text === "🎁 So'vg'a olish" || text === "🎁 Получить подарок") {
      const isRu = text === "🎁 Получить подарок";
      const replyText = isRu ? "📸 **Пожалуйста, отправьте скриншот...**" : "📸 **Iltimos, izoh yozilgan skrinshot...**";
      const keyboard = isRu && keyboards.backKeyboardRu ? keyboards.backKeyboardRu : keyboards.backKeyboard;
      await bot.sendMessage(chatId, replyText, { parse_mode: "Markdown", ...keyboard });
    }
    else if (text === "⬅️ Orqaga" || text === "⬅️ Назад") {
      const isRu = text === "⬅️ Назад";
      const replyText = isRu ? "Возврат в главное меню:" : "Bosh menyuga qaytildi:";
      const keyboard = isRu && keyboards.mainMenuRu ? keyboards.mainMenuRu : keyboards.mainMenu;
      await bot.sendMessage(chatId, replyText, keyboard);
    }
    else if (text === "📦 Katalog" || text === "📦 Каталог") {
      const isRu = text === "📦 Каталог";
      const replyText = isRu ? "Наш магазин:" : "Bizning do'konimiz:";
      const keyboard = isRu && keyboards.webAppButtonRu ? keyboards.webAppButtonRu : keyboards.webAppButton;
      await bot.sendMessage(chatId, replyText, keyboard);
    }
    else if (text === "❓ Savol berish" || text === "❓ Задать вопрос") {
      const isRu = text === "❓ Задать вопрос";
      const replyText = isRu ? "Напишите свой вопрос..." : "Savolingizni yozib qoldiring...";
      const keyboard = isRu && keyboards.backKeyboardRu ? keyboards.backKeyboardRu : keyboards.backKeyboard;
      await bot.sendMessage(chatId, replyText, keyboard);
    }
    else if (text === "/start") {
      return;
    }
    else {
      // 7. CHAT (Oddiy matn)
      try {
        await axios.post(`${BACKEND_URL}/chat/receive-from-bot`, {
          telegramId: chatId,
          text: text,
          type: "text",
        });
      } catch (e) {
        console.log("Chat xatosi:", e.message);
      }
    }
  });
};