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

    // Kontakt so'rash (UZ)
    contactKeyboard: {
        reply_markup: {
            keyboard: [
                [{ text: "📱 Telefon raqamni yuborish", request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    },

    // Asosiy menyu (UZ)
    mainMenu: {
        reply_markup: {
            keyboard: [
                [{ text: "🎁 So'vg'a olish" }, { text: "📦 Katalog" }],
                [{ text: "❓ Savol berish" }]
            ],
            resize_keyboard: true
        }
    },

    // Orqaga qaytish (UZ)
    backKeyboard: {
        reply_markup: {
            keyboard: [
                [{ text: "⬅️ Orqaga" }]
            ],
            resize_keyboard: true
        }
    },

    // Web App (UZ)
    webAppButton: {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Do'konni ochish 🛍", web_app: { url: "https://google.com" } }] 
            ]
        }
    },

    // ------------------------------------------------
    // 🇷🇺 RUSCHA MENYULAR (YANGI)
    // ------------------------------------------------

    // Kontakt so'rash (RU)
    contactKeyboardRu: {
        reply_markup: {
            keyboard: [
                [{ text: "📱 Отправить номер телефона", request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    },

    // Asosiy menyu (RU)
    mainMenuRu: {
        reply_markup: {
            keyboard: [
                [{ text: "🎁 Получить подарок" }, { text: "📦 Каталог" }],
                [{ text: "❓ Задать вопрос" }]
            ],
            resize_keyboard: true
        }
    },

    // Orqaga qaytish (RU)
    backKeyboardRu: {
        reply_markup: {
            keyboard: [
                [{ text: "⬅️ Назад" }]
            ],
            resize_keyboard: true
        }
    },

    // Web App (RU)
    webAppButtonRu: {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Открыть магазин 🛍", web_app: { url: "https://google.com" } }] 
            ]
        }
    }
};