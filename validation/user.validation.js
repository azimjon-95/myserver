const Joi = require('joi');


const userValidationSchema = Joi.object({
    username: Joi.string()
        .required()
        .min(4)
        .max(25)
        .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
        .trim()
        .messages({
            'string.base': `Foydalanuvchi nomi matn bo'lishi kerak`,
            'string.min': `Foydalanuvchi nomi kamida 4 ta belgidan iborat bo'lishi kerak`,
            'string.max': `Foydalanuvchi nomi ko'pi bilan 25 ta belgidan iborat bo'lishi kerak`,
            'string.pattern.base': `Foydalanuvchi nomi faqat harflar, raqamlar va pastki chiziqlardan iborat bo'lishi mumkin`,
            'string.empty': `Foydalanuvchi nomi kiritilishi shart`
        }),

    password: Joi.string()
        .required()
        .min(6)
        .messages({
            'string.base': `Parol matn ko'rinishida bo'lishi kerak`,
            'string.min': `Parol kamida 6 ta belgidan iborat bo'lishi kerak`,
            'string.empty': `Parol kiritilishi shart`,
            'any.required': `Parol kiritilishi majburiy`
        }),
    fullName: Joi.string()
        .required()
        .min(4)
        .max(50)
        .trim()
        .messages({
            'string.base': `Ism matn ko'rinishida bo'lishi kerak`,
            'string.min': `Ism kamida 4 ta belgidan iborat bo'lishi kerak`,
            'string.max': `Ism ko'pi bilan 50 ta belgidan iborat bo'lishi mumkin`,
            'string.empty': `Ism kiritilishi shart`,
            'any.required': `Ism kiritilishi majburiy`
        }),
    dateOfBirth: Joi.string()
        .pattern(/^\d{2}\.\d{2}\.\d{4}$/)
        .messages({
            'string.base': `Tug'ilgan sana matn ko'rinishida bo'lishi kerak`,
            'string.pattern.base': `Tug'ilgan sana quyidagi formatda bo'lishi kerak: DD.MM.YYYY (masalan, 15.07.1995)`,
        }),

});

// Validatsiya funksiyasi
const validateUser = (userData) => {
    const { error } = userValidationSchema.validate(userData, { abortEarly: false });
    if (error) {
        return { error: error.details.map((err) => err.message).join(', ') };
    }
    return { error: null };
}
module.exports = validateUser;