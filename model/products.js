const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        require: [true, "Maxsulot nomi majburiy."],
        unique: true,
        trim: true,
        minlength: [4, "Maxsulot nomi 2 ta belgidan iborat  bo'lishi kerak."],
        maxlength: [25, "Maxsulot nomi 25 ta belgidan oshmasligi kerak."],
    },
    // product images
    images: { type: [String], default: [] },

    newPrice: {
        type: Number,
        require: [true, "Maxsulot yangi narxi  majburiy."],
        minlength: [2, "Maxsulot yangi narxi 2 ta belgidan iborat  bo'lishi kerak."],
    },
    oldPrice: {
        type: String,
        require: [true, "Maxsulot eski narx majburiy."],
        trim: true,
        minlength: [3, "Maxsulot eski narx 3 ta belgidan iborat  bo'lishi kerak."],
        maxlength: [50, "Maxsulot eski narx 50 ta belgidan oshmasligi kerak."],
    },
    quantity: {
        type: Number
    },
}, { timestamps: true })
const Product = model('product', productSchema);
module.exports = Product;


