const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        require: [true, "Foydalanuvchi nomi majburiy."],
        unique: true,
        trim: true,
        minlength: [4, "Foydalanuvchi nomi 4 ta belgidan iborat  bo'lishi kerak."],
        maxlength: [25, "Foydalanuvchi nomi 25 ta belgidan oshmasligi kerak."],
    },
    password: {
        type: String,
        require: [true, "Foydalanuvchi paroli majburiy."],
        minlength: [6, "Foydalanuvchi nomi 6 ta belgidan iborat  bo'lishi kerak."],
    },
    fullName: {
        type: String,
        require: [true, "Foydalanuvchi Ism va Familyasi majburiy."],
        trim: true,
        minlength: [3, "Foydalanuvchi Ism va Familyasi 3 ta belgidan iborat  bo'lishi kerak."],
        maxlength: [50, "Foydalanuvchi Ism va Familyasi 50 ta belgidan oshmasligi kerak."],
    },
    dateOfBirth: {
        type: String,
        validate: {
            validator: function (value) {
                // Dana formati tekshirish (DD.MM.YYYY)
                return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
            },
            message: "Tug'ilgan kun (DD.MM.YYYY) formatda bo'lishi kerak.",
        }
    },
}, { timestamps: true })
const User = model('user', userSchema);
module.exports = User;


