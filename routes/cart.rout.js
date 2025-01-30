const { Router } = require('express');
const {
    updateQuantity,
    addToCart,
    getFromCart,
    deleteItem
} = require('../controller/cart.ctrl');

const cart = Router();
cart.patch('/quantity/:userId', updateQuantity);
cart.post('/add', addToCart);
cart.get('/get/:userId', getFromCart);
cart.delete('/delete/:userId/:productId', deleteItem);


module.exports = cart; 
