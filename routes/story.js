const { Router } = require('express');
const {
    GetStory,
    Purchare,
    GetBalanse
} = require('../controller/story_products.ctrl');

const purch = Router();

purch.get('/getData', GetStory);
purch.get('/getBalanse', GetBalanse);
purch.post('/purchare', Purchare);



module.exports = purch; 
