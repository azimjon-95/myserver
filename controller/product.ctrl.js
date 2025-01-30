const Product = require('../model/products');
require('dotenv').config();

// Get product
const getProduct = async (req, res) => {
    try {
        const data = await Product.find();
        res.json({
            success: true,
            message: "All data",
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


// Delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images from ImgBB
        if (product.images && product.images.length > 0) {
            const imageDeletePromises = product.images.map(imageUrl => {
                const imageId = imageUrl.split('/').pop().split('.')[0]; // Extract the image ID from URL
                return axios.delete(`${process.env.IMAGE_BB_API_URL}/delete/${imageId}?key=${process.env.IMAGE_BB_API_KEY}`);
            });

            // Wait for all image deletions to complete
            await Promise.all(imageDeletePromises);
        }

        // Delete the product from the database
        await Product.findByIdAndDelete(id);

        res.json({ message: 'Product and its images deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product', error });
    }
};


// Update product
const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete old images from ImgBB if the product has images
        if (product.images && product.images.length > 0) {
            const imageDeletePromises = product.images.map(imageUrl => {
                const imageId = imageUrl.split('/').pop().split('.')[0]; // Extract the image ID from URL
                return axios.delete(`${process.env.IMAGE_BB_API_URL}/delete/${imageId}?key=${process.env.IMAGE_BB_API_KEY}`);
            });

            // Wait for all image deletions to complete
            await Promise.all(imageDeletePromises);
        }

        // Handle new images if any
        let newImageUrls = product.images || [];
        if (req.files && req.files.length > 0) {
            const formData = new FormData();

            // Upload each new image to ImgBB
            const uploadPromises = req.files.map(file => {
                formData.append('image', file.buffer, file.originalname);
                return axios.post(
                    `${process.env.IMAGE_BB_API_URL}?key=${process.env.IMAGE_BB_API_KEY}`,
                    formData,
                    { headers: { ...formData.getHeaders() } }
                );
            });

            // Wait for all image uploads to complete
            const uploadedImages = await Promise.all(uploadPromises);

            // Add the URLs of uploaded images to the newImageUrls array
            newImageUrls = uploadedImages.map(response => response.data.data.url);
        }

        // Update the product with new data and images
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            ...req.body,
            images: newImageUrls
        }, { new: true });

        res.json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};

//Get by id
const GetbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Product.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(user);

    } catch (error) {
        console.log(error);
    }
}

// get data query
const GetQuery = async (req, res) => {
    const { query } = req.query;

    const product = await Product.find({ name: { $regex: query, $options: 'i' } });

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
        success: true,
        data: product,
        message: "All data"
    });
}


// Boshlang'ich narxlarni olish
const getMaxAndMinPrice = async (req, res) => {
    try {
        const prices = await Product.find();
        const priceValues = prices.map((p) => { p.newPrice })
        const minPrice = Math.min(...priceValues);
        const maxPrice = Math.max(...priceValues);
        res.json({ minPrice, maxPrice });
        console.log(minPrice, maxPrice);
    }
    catch (err) {
        console.log(err);
    }
}

// Maxsulotlarni narx bo'yicha filterlash endpoint
const GetDatasByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.body;

    //Filterni tayorlash
    const filter = {};

    if (minPrice & maxPrice) {
        filter.newPrice = { $gte: minPrice, $lte: maxPrice }
    } else if (minPrice) {
        filter.newPrice = { $gte: minPrice }
    } else if (maxPrice) {
        filter.newPrice = { $lte: maxPrice }
    }

    // Filterlash va natijalarini olish
    const product = await Product.find(filter);

    //Javob qaytarish
    res.status(200).json({
        success: true,
        data: product,
        message: "All data"
    })
}

module.exports = {
    getMaxAndMinPrice,
    GetDatasByPrice,
    GetQuery,
    GetbyId,
    getProduct,
    deleteProduct,
    updateProduct
}

