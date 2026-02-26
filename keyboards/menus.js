module.exports = {
    // 1. TIL TANLASH (Umumiy)
    languageKeyboard: {
        reply_markup: {
            keyboard: [
                [{ text: "🇺🇿 O'zbek tili" }, { text: "🇷🇺 Русский язык" }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    },

    // ------------------------------------------------
    // 🇺🇿 O'ZBEKCHA MENYULAR
    // ------------------------------------------------
    contactKeyboard: {
        reply_markup: {
            keyboard: [
                [{ text: "📱 Telefon raqamni yuborish", request_contact: true }],
                [{ text: "⬅️ Orqaga" }] // 🔥 QO'SHILDI
            ],
            resize_keyboard: true
        }
    },

    mainMenu: {
        reply_markup: {
            keyboard: [
                [{ text: "🎁 So'vg'a olish" }, { text: "❓ Savol yozish" }],
                [{ text: "⬅️ Orqaga" }] // 🔥 QO'SHILDI
            ],
            resize_keyboard: true
        }
    },

    backKeyboard: {
        reply_markup: {
            keyboard: [
                [{ text: "⬅️ Orqaga" }]
            ],
            resize_keyboard: true
        }
    },

    // ------------------------------------------------
    // 🇷🇺 RUSCHA MENYULAR
    // ------------------------------------------------
    contactKeyboardRu: {
        reply_markup: {
            keyboard: [
                [{ text: "📱 Отправить номер телефона", request_contact: true }],
                [{ text: "⬅️ Назад" }] // 🔥 QO'SHILDI
            ],
            resize_keyboard: true
        }
    },

    mainMenuRu: {
        reply_markup: {
            keyboard: [
                [{ text: "🎁 Получить подарок" }, { text: "❓ Задать вопрос" }],
                [{ text: "⬅️ Назад" }] // 🔥 QO'SHILDI
            ],
            resize_keyboard: true
        }
    },

    backKeyboardRu: {
        reply_markup: {
            keyboard: [
                [{ text: "⬅️ Назад" }]
            ],
            resize_keyboard: true
        }
    }
};