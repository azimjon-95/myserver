const { Schema, model } = require('mongoose');

const balanceSchema = new Schema({
    userId: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Balance = model('balance', balanceSchema);
module.exports = Balance;


