const Cart = require('../model/cart');
const Product = require('../model/products');

// Get users
const getFromCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartData = await Cart.findOne({ userId }).populate('items.productId');

        if (!cartData) {
            return res.json({
                success: false,
                message: "Cart not found for this user",
            });
        }

        const allProducts = await Product.find();
        const filteredItems = cartData.items.filter(cartItem =>
            allProducts.some(product => product._id.equals(cartItem.productId._id))
        );

        // Yangi ma'lumotlar formatini yaratish
        const formattedData = filteredItems.map(cartItem => {
            const product = allProducts.find(p => p._id.equals(cartItem.productId._id));
            return {
                productId: product._id,
                name: product.name,
                newPrice: product.newPrice,
                oldPrice: product.oldPrice,
                quantity: cartItem.quantity
            };
        });

        res.json({
            success: true,
            message: "Filtered cart data",
            data: formattedData
        });
    } catch (err) {
        res.json({
            success: false,
            message: "Error",
            data: err
        })
    }
}

// add to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cartData = await Cart.findOne({ userId });

        if (cartData) {
            const itemIndex = cartData.items.findIndex(item => item.productId.equals(productId));
            if (itemIndex > -1) {
                cartData.items[itemIndex].quantity += quantity;
            }
            else {
                cartData.items.push({ productId, quantity });
            }
            await cartData.save();
            return res.json({ message: 'Product added to cart successfully' });
        } else {
            const newData = {
                userId,
                items: [
                    {
                        productId,
                        quantity
                    }
                ]
            }
            const cart = new Cart(newData);
            await cart.save();
            res.json({ message: 'Product added to cart successfully' });
        }
    }
    catch (error) {
        console.log(error);
    }
}

// Increment/Decrement quantity
const updateQuantity = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, increment } = req.body;
        const cart = await Cart.findOne({ userId });
        console.log(productId, increment, userId);

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId))
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += increment ? 1 : -1;

                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                }
            }
            await cart.save();
        }
        res.json({ message: 'Quantity updated successfully' });
    }
    catch (error) {
        console.log(error);
    }
};

// Delete items from cart
const deleteItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

            if (itemIndex > -1) {
                cart.items.splice(itemIndex, 1);
                await cart.save();
                res.json({ message: 'Item deleted from cart successfully' });
            }
        };
        res.json({ message: "Item not found in cart" })
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    updateQuantity,
    addToCart,
    deleteItem,
    getFromCart
}