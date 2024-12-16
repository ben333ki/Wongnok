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
const app = express();

const port = 3000;
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/"
const client = new MongoClient(url);
const dbName = "WongNok"; // กำหนดชื่อฐานข้อมูลที่ต้องการใช้งาน


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // เพิ่มบรรทัดนี้เพื่อให้รองรับการรับข้อมูลในรูปแบบ JSON


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/register', (req, res) => {
    res.render('user/register', { title: 'Register Page' });
});

app.get('/home', (req, res) => {
    res.render('user/home', { title: 'Home Page' });
});

app.get('/', (req, res) => {
    res.redirect('/register');
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(path.join(__dirname, 'views', 'partials')); 
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        
        // เพิ่มข้อมูลผู้ใช้ใหม่
        const result = await usersCollection.insertOne({ name, username, email, password });
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






