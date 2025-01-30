const { Schema, model } = require('mongoose');

const storySchema = new Schema({
    userId: {
        type: String
    },
    fullName: {
        type: String
    },
    items: [],
    totalPrice: {
        type: Number
    },
    purchaseDate: {
        type: Date
    }

}, { timestamps: true })
const Story = model('story', storySchema);
module.exports = Story;


