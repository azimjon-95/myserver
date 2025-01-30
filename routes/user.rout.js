const { Router } = require('express');
const {
    GetQuery,
    GetUser,
    SignUp,
    SignIn,
    Logout,
    Delete,
    Update,
    GetbyId
} = require('../controller/user.ctrl');
const validateUser = require('../validation/user.validation');

const user = Router();

user.get('/getData', GetUser);
user.post('/signUp', SignUp, validateUser);
user.post('/signIn', SignIn);
user.post('/logout', Logout);
user.delete('/delete/:id', Delete);
user.put('/update/:id', Update);
user.get('/getbyid/:id', GetbyId);
user.get('/search', GetQuery);
module.exports = user; 
