const { Sequelize } = require('sequelize');

// กำหนดค่าการเชื่อมต่อ MySQL
const config = {
    mysql: {
        database: 'wongnok', // ชื่อฐานข้อมูล
        username: 'root',     // ชื่อผู้ใช้ MySQL
        password: 'ben333ki',     // รหัสผ่าน MySQL
        host: 'localhost',             // หรือ IP ของเซิร์ฟเวอร์ MySQL
        dialect: 'mysql',              // ใช้ MySQL
    },
};

// สร้าง Sequelize instance
const sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password,
    {
        host: config.mysql.host,
        dialect: config.mysql.dialect,
        logging: false, // ปิดการแสดง log SQL
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// ทดสอบการเชื่อมต่อ
sequelize
    .authenticate()
    .then(() => console.log('MySQL Connected'))
    .catch((err) => console.error('Unable to connect to MySQL:', err));

module.exports = { sequelize }; // Exporting the sequelize instance
