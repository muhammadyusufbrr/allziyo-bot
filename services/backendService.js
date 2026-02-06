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

// 🔥 4. PROMOKODLARNI "AQLLI" OLISH (YANGILANDI)
async function getPromos() {
    try {
        // Admin panel ishlatadigan API ga murojaat qilamiz
        const response = await axios.get(`${BACKEND_URL}/promocodes`);
        const allPromos = response.data.data; // Bazadagi hamma promokodlar ro'yxati

        // 1. "Start" uchun 5% lik kodni qidiramiz
        const welcomeObj = allPromos.find(p => p.percentage === 5);
        
        // 2. "Registratsiya" uchun 15% (yoki 10%) lik kodni qidiramiz
        const registerObj = allPromos.find(p => p.percentage === 15 || p.percentage === 10);

        return {
            // Agar bazada topilsa o'shani olamiz, topilmasa "Zaxira" kodni beramiz
            welcomePromo: welcomeObj ? welcomeObj.name : "WELCOME5",
            registerPromo: registerObj ? registerObj.name : "SUPER15"
        };
    } catch (error) {
        console.error('Get Promo Error:', error.message);
        // Backend o'chsa zaxira:
        return { welcomePromo: "WELCOME5", registerPromo: "SUPER15" };
    }
}

module.exports = { saveUser, updatePhone, sendReview, getPromos };