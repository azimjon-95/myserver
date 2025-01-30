const express = require('express');
const cookieParser = require('cookie-parser');
require('./data/db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Cors bu api ga ro'xsat berish fronga malumotlarni uzatib berishni taminlaydi
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'authorization',
    ]
}));



app.get('/', (req, res) => {
    res.send('Hello World')
})

const user = require('./routes/user.rout');
const product = require('./routes/product.rout');
const cart = require('./routes/cart.rout');
const story = require('./routes/story');
app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/cart', cart);
app.use('/api/story', story);

const port = process.env.PORT || 4050; // Change port to 8051 or any other available port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});