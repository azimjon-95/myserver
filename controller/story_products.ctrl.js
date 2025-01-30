const Story = require('../model/story');
const User = require('../model/user.model');
const Product = require('../model/products');
const Balance = require('../model/balance');

// Get users
const GetStory = async (req, res) => {
    try {
        const data = await Story.find();
        res.json({
            success: true,
            message: "All Story data",
            data
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Error",
            data: err
        })
    }
}

const GetBalanse = async (req, res) => {
    try {
        const data = await Balance.find();
        res.json({
            success: true,
            message: "All Balanse data",
            data
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Error",
            data: err
        })
    }
}

// SignUp
const Purchare = async (req, res) => {
    try {
        const { userId, items, totalPrice } = req.body;

        // Check if the user
        const existingUser = await User.findOne({ _id: userId });

        if (!existingUser) {
            return res.status(400).json({ message: "User is not found!" });
        }

        // Maxsulotlarni zaxirasini tekshirish
        const productIds = items.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== items.length) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Zaxiradagi maxsulotni miqdorini tekshirish
        const insufficientStock = items.some(item => {
            const product = products.find(product => product._id.toString() === item.productId);
            return product.quantity < item.quantity;
        })

        if (insufficientStock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            })
        }

        // Maxsulotni yangilash va saqlash
        const updatePromises = items.map(async (item) => {
            // Maxsulotni yangilash
            const product = await Product.findOne({ _id: item.productId });

            if (product) {
                // Quantity ni yangilash
                product.quantity -= item.quantity;

                // Saqlash
                await product.save();
            }
        });

        // Barcha yangilash va saqlash operatsiyalarini parallel bajarish
        await Promise.all(updatePromises);



        // Yangi maxsulotga story yaratish
        const newUserStory = {
            userId,
            fullName: existingUser.fullName,
            items,
            totalPrice,
            purchaseDate: new Date(),
        };

        const newStory = await Story.create(newUserStory);
        await newStory.save();

        // Malansni yangilash yoki qo'shish
        const userBalance = await Balance.findOne({ userId });
        if (userBalance) {
            userBalance.balance += totalPrice;
            await userBalance.save();
        } else {
            const newBalance = new Balance(
                {
                    userId,
                    balance: totalPrice
                }
            );
            await newBalance.save();
        }

        res.json({
            success: true,
            message: "Story created successfully",
            data: newStory
        })
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    GetStory,
    Purchare,
    GetBalanse
}