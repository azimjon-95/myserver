const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
    userId: {
        type: String
    },
    items: [
        {
            productId: Schema.Types.ObjectId,
            quantity: Number
        }

    ]
}, { timestamps: true })
const Cart = model('cart', cartSchema);
module.exports = Cart;


