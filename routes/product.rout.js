const { Router } = require('express');
const Product = require('../model/products');
const Multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const product = Router();
require('dotenv').config();

const {
    GetQuery,
    GetbyId,
    getProduct,
    deleteProduct,
    updateProduct,
    GetDatasByPrice,
    getMaxAndMinPrice,
} = require('../controller/product.ctrl');


const storage = Multer.memoryStorage(); // Rasimni  xotirada saqlash
const upload = Multer({ storage });


product.get('/getData', getProduct);
product.post('/filter/by/price', GetDatasByPrice);
product.delete('/delete/:id', deleteProduct);
product.put('/update/:id', updateProduct);
product.get('/getbyid/:id', GetbyId);
product.get('/search', GetQuery);
product.get('/max/min', getMaxAndMinPrice);


product.post('/create', upload.array('images', 3), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        const imageUrls = [];
        for (const file of req.files) {
            const formData = new FormData();
            formData.append('image', file.buffer.toString('base64'));

            const response = await axios.post(
                `${process.env.IMAGE_BB_API_URL}?key=${process.env.IMAGE_BB_API_KEY}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response?.data?.data?.url) {
                imageUrls.push(response.data.data.url);
            }
        }

        const newProduct = new Product({
            ...req.body,
            images: imageUrls,
        });
        await newProduct.save();

        res.json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Product creation failed:', error.message);
        res.status(500).json({ message: 'Error creating product', error });
    }
});




module.exports = product;
