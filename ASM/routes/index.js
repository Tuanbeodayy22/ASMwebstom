const express = require('express');
const router = express.Router();
const { Car } = require('../models/database');
const app = express();

// Middleware xử lý JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Kiểm tra xem client có yêu cầu JSON hay không
 */
const isJsonRequest = (req) =>
    req.headers.accept && req.headers.accept.includes('application/json');

// **API Lấy danh sách xe (JSON)**
router.get('/', async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.status(200).json({
      success: true,
      data: cars, // Dữ liệu trả về là danh sách JSON phẳng
    });
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách xe.',
    });
  }
});

// **API Lấy danh sách xe (HTML)**
router.get('/html', async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.render('index', { cars }); // Hiển thị danh sách xe trên giao diện HTML
  } catch (err) {
    console.error('Error fetching cars for HTML:', err);
    res.status(500).send('Lỗi khi lấy danh sách xe.');
  }
});

// **API Thêm xe mới**
router.post('/add', async (req, res) => {
  console.log('Request received for add:', req.body);

  try {
    const { name, manufacturer, year, price, description } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !manufacturer || !year || !price || !description) {
      console.error('Invalid input data:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không đầy đủ hoặc không hợp lệ.',
      });
    }

    // Thêm xe vào cơ sở dữ liệu
    const newCar = await Car.create({ name, manufacturer, year, price, description });

    console.log('Car added successfully:', newCar.toJSON());
    res.status(201).json({
      success: true,
      message: 'Thêm xe thành công.',
      data: newCar,
    });
  } catch (err) {
    console.error('Error adding car:', err); // Log lỗi chi tiết
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm xe.',
    });
  }
});

// **API Xóa xe**
router.delete('/delete/:id', async (req, res) => {
  console.log('Request received for delete:', req.params.id);

  try {
    const carId = req.params.id;

    const car = await Car.findByPk(carId);
    if (!car) {
      console.error('Car not found for delete:', carId);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe cần xóa.',
      });
    }

    await car.destroy();
    console.log('Car deleted successfully:', car.toJSON());

    res.status(200).json({
      success: true,
      message: `Xóa xe thành công với ID ${carId}.`,
    });
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa xe.',
    });
  }
});

// **API Cập nhật thông tin xe**
router.put('/update/:id', async (req, res) => {
  console.log('Request received for update:', req.params.id);
  console.log('Request body:', req.body);

  try {
    const carId = req.params.id;
    const { name, manufacturer, year, price, description } = req.body;

    // Kiểm tra ID hợp lệ
    if (!carId) {
      console.error('Invalid ID:', carId);
      return res.status(400).json({
        success: false,
        message: 'ID xe không hợp lệ.',
      });
    }

    // Tìm xe trong cơ sở dữ liệu
    const car = await Car.findByPk(carId);
    if (!car) {
      console.error('Car not found for update:', carId);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe cần cập nhật.',
      });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!name || !manufacturer || !year || !price || !description) {
      console.error('Invalid input data:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu đầu vào không đầy đủ hoặc không hợp lệ.',
      });
    }

    console.log('Before update:', car.toJSON());
    await car.update({ name, manufacturer, year, price, description });
    console.log('After update:', car.toJSON());

    res.status(200).json({
      success: true,
      message: 'Cập nhật xe thành công.',
      data: car.toJSON(), // Trả về JSON phẳng
    });
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật xe.',
    });
  }
});

module.exports = router;
