// const express = require('express');
// const app = express();

// // Set EJS as the template engine
// app.set('view engine', 'ejs');

// // Route to render an EJS view
// app.get('/', (req, res) => {
//   res.render('index', { message: 'Hello, EJS!' });
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log('Server is running on http://localhost:${PORT}');
// });

const express = require('express');
const path = require('path');
const { error } = require('console');
const bcrypt = require('bcrypt');  // นำเข้า bcrypt
const app = express();


const port = 3000;
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);
const dbName = "WongNok"; // กำหนดชื่อฐานข้อมูลที่ต้องการใช้งาน

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // เพิ่มบรรทัดนี้เพื่อให้รองรับการรับข้อมูลในรูปแบบ JSON
app.use(express.json());  // เพิ่มบรรทัดนี้เพื่อรับข้อมูลในรูปแบบ JSON


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/register', (req, res) => {
    res.render('user/register', { title: 'Register Page' });
});

app.get('/home', (req, res) => {
    res.render('user/home', { title: 'Home Page' });
});

app.get('/login', (req, res) => {
    res.render('user/login', { title: 'Login Page' });
});

app.get('/', (req, res) => {
    res.redirect('/register');
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Register User
app.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    // 1. ตรวจสอบความยาวของ Password
    if (password.length < 8) {
        return res.status(400).send('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
    }

    // 2. ตรวจสอบว่ามี Username นี้ในระบบหรือไม่
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ username: username });
        if (existingUser) {
            return res.status(400).send('ชื่อผู้ใช้นี้มีผู้ใช้แล้ว กรุณาลองชื่อผู้ใช้อื่น');
        }

        // 3. ตรวจสอบว่า confirm password ตรงกับ password หรือไม่
        if (password !== req.body.confirm) {
            return res.status(400).send('Password และ Confirm Password ไม่ตรงกัน');
        }

        // แฮชรหัสผ่านก่อนเก็บลงฐานข้อมูล
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await usersCollection.insertOne({
            name,
            username,
            email,
            password: hashedPassword
        });

        console.log('ผู้ใช้ใหม่เพิ่มสำเร็จ:', result.insertedId);

        // ส่งข้อความกลับไปยังคลไคลเอนต์
        res.status(200).send('สมัครสมาชิกสำเร็จ');
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสมัครสมาชิก:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
        await client.close();
    }
});



// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // เชื่อมต่อกับ MongoDB
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users'); // ชื่อคอลเล็กชันของผู้ใช้

        // ค้นหาผู้ใช้จาก username
        const user = await usersCollection.findOne({ username: username });

        if (!user) {
            return res.status(400).send('ผู้ใช้ไม่พบ');
        }

        // เปรียบเทียบรหัสผ่านที่ผู้ใช้กรอกกับรหัสผ่านที่เก็บไว้ใน DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // เข้าสู่ระบบสำเร็จ
            res.redirect('/home');
        } else {
            return res.status(400).send('รหัสผ่านไม่ถูกต้อง');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
        await client.close();
    }
});








