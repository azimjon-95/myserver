const mongoose = require('mongoose');


const Database = () => {
    mongoose.connect('mongodb+srv://mamutaliyev95:online_dars@cluster0.euyr3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.error('Error connecting to MongoDB:', err);
        })
}
Database();