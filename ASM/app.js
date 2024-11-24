const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

// Cấu hình EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware xử lý JSON và URL-encoded
app.use(express.json()); // Middleware xử lý dữ liệu JSON từ body
app.use(express.urlencoded({ extended: true })); // Middleware xử lý form data (URL-encoded)

// Middleware cho file tĩnh (CSS, JS, hình ảnh, v.v.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);

// Xử lý lỗi 404
app.use((req, res, next) => {
    res.status(404).send('Không tìm thấy trang!');
});

// Xử lý lỗi tổng quát
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Có lỗi xảy ra trên server!' });
});

module.exports = app;
