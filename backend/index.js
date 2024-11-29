const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { poolPromise, sql } = require('./dbconfig');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Bảng Khách Hàng
app.get('/api/data/customer', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Customer');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Email
app.get('/api/data/email', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM EMAIL');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Bảng nhà cung cấp
app.get('/api/data/vendor', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Vendor');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bang Category
app.get('/api/data/category', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Category');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng sản phẩm
app.get('/api/data/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Orders
app.get('/api/data/orders', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Orders');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Invoice
app.get('/api/data/invoice', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Invoice');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng OrderDetail
app.get('/api/data/orderdetail', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Order_detail');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Bảng CART
app.get('/api/data/cart', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM CART');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Vouchers
app.get('/api/data/vouchers', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Vouchers');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng HouseholdApplication
app.get('/api/data/HouseholdApplication', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM HouseholdApplication');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng ElectronicEquipment
app.get('/api/data/ElectronicEquipment', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM ElectronicEquipment');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Accessory
app.get('/api/data/Accessory', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Accessory');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Fashion
app.get('/api/data/Fashion', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Fashion');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng PaymentMethod
app.get('/api/data/PaymentMethod', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM PaymentMethod');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Complaint
app.get('/api/data/Complaint', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Complaint');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Bảng Review
app.get('/api/data/Review', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Review');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});