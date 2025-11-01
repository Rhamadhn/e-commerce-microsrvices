const express = require('express');
const app = express();
const sequelize = require('./database');
const { DataTypes } = require('sequelize');
const cors = require('cors');

// Middleware untuk parsing JSON
app.use(express.json());
app.use(cors());

// Definisi model Produk
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

// Inisialisasi Database
const initDb = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Tabel produk berhasil dibuat di database.");
    }catch(error){
        console.error("Error ketika membuat database:", error);
    }
};

initDb();

// Response standar
const successResponse = (res, message, data = null) => {
    res.status(200).json({
        success: true,
        message: message,
        data: data
    });
};

const errorResponse = (res, status, message) => {
    res.status(status).json({
        success: true,
        message: message
    });
};

// API untuk menambahkan produk baru
app.post('/products', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        
        if (!name || !price) {
            return errorResponse(res, 400, 'Nama dan Harga produk wajib diisi!');
        }

        const newProduct = await Product.create({ name, description, price });
        successResponse(res, 'Produk berhasil ditambahkan ke tabel produk di database', newProduct);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Gagal menambah sebuah produk, silakan coba lagi.');
    }
});

// API untuk mendapatkan semua produk
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        successResponse(res, 'Products Retrieved Successfully', products);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Error Retrieving Products');
    }
});

// API untuk mendapatkan produk berdasarkan ID
app.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findByPk(id);
        
        if (!product) {
            return errorResponse(res, 404, 'Product Not Found');
        }

        successResponse(res, 'Product Retrieved Successfully', product);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Error Retrieving Product');
    }
});


app.put('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description, price } = req.body;

        if (!name || !price) {
            return errorResponse(res, 400, 'Nama dan harga produk wajib diisi!');
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return errorResponse(res, 404, 'Produk yang dimaksud tidak ditemukan!');
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        successResponse(res, 'Data produk berhasil diperbaruhi!', product);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Terjadi error saat memperbaruhi data produk!');
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findByPk(id);

        if (!product) {
            return errorResponse(res, 404, 'Produk yang dimaksud tidak ditemukan!');
        }

        await product.destroy();
        successResponse(res, 'Data peoduk berhasul dihapus dari database!');
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Terjadi error saat menghapus data produk!');
    }
});

// Menjalankan server
app.listen(3000, () => {
    console.log('Listening on port 3000');
});