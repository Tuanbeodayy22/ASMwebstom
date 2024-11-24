const { Sequelize, DataTypes } = require('sequelize');

// Kết nối SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './cars.db', // Tên file cơ sở dữ liệu
});

// Định nghĩa model Car với timestamps tắt
const Car = sequelize.define('Car', {
    name: { type: DataTypes.STRING, allowNull: false },
    manufacturer: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: true, // Tắt timestamps
});

// Đồng bộ cơ sở dữ liệu
sequelize.sync()
    .then(() => console.log('Cơ sở dữ liệu đã đồng bộ.'))
    .catch((err) => console.error('Lỗi khi đồng bộ cơ sở dữ liệu:', err));

module.exports = { sequelize, Car };
