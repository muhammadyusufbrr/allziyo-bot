const axios = require('axios');
const FormData = require('form-data');
const { BACKEND_URL } = require('../config/api');

// 1. Userni saqlash
async function saveUser(userData) {
    try {
        const response = await axios.post(`${BACKEND_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error('Save User Error:', error.message);
        return null;
    }
}

// 2. Telefon raqamni yangilash
async function updatePhone(telegramId, phoneNumber) {
    try {
        await axios.post(`${BACKEND_URL}/users/phone`, { telegramId, phoneNumber });
    } catch (error) {
        console.error('Update Phone Error:', error.message);
    }
}

// 3. Rasmni Backendga yuborish
async function sendReview(telegramId, imageStream, comment) {
    try {
        const form = new FormData();
        form.append('telegramId', telegramId);
        form.append('comment', comment || 'Bot orqali yuklandi');
        form.append('image', imageStream, { 
            filename: 'review.jpg',
            contentType: 'image/jpeg' 
        });

        const response = await axios.post(`${BACKEND_URL}/reviews`, form, {
            headers: { ...form.getHeaders() }
        });
        return response.data;
    } catch (error) {
        console.error('Send Review Error:', error.message);
        return null;
    }
}

// 🔥 4. PROMOKODLARNI QAT'IY FOIZ BO'YICHA OLISH (5% va 10%)
async function getPromos() {
    try {
        const response = await axios.get(`${BACKEND_URL}/promocodes`);
        const allPromos = response.data.data || []; 

        // 1. Faqatgina 5% lik kodni qidiramiz (Start uchun)
        const welcomeObj = allPromos.find(p => p.percentage === 5);
        
        // 2. Faqatgina 10% lik kodni qidiramiz (Kontakt uchun)
        const registerObj = allPromos.find(p => p.percentage === 10);

        return {
            welcomePromo: { 
                // Agar 5% lik kod topilsa shuni beradi, bo'lmasa zaxira "WELCOME5" ni beradi
                code: welcomeObj ? welcomeObj.name : "WELCOME5", 
                percent: welcomeObj ? welcomeObj.percentage : 5 
            },
            registerPromo: { 
                // Agar 10% lik kod topilsa shuni beradi, bo'lmasa zaxira "SUPER10" ni beradi
                code: registerObj ? registerObj.name : "SUPER10", 
                percent: registerObj ? registerObj.percentage : 10 
            }
        };
    } catch (error) {
        console.error('Get Promo Error:', error.message);
        // API ishlamay qolsa, qotib qolmasligi uchun default qiymatlar
        return { 
            welcomePromo: { code: "WELCOME5", percent: 5 }, 
            registerPromo: { code: "SUPER10", percent: 10 } 
        };
    }
}

module.exports = { saveUser, updatePhone, sendReview, getPromos };