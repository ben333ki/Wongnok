const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const router = express.Router();
const fs = require('fs');

router.use(cors()); 

router.use(express.json());

router.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "css222",
    database: "wongnok"
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL successfully");
});
// -----------------------------------------------------------------------------------
const bcrypt = require('bcrypt');

// ตัวอย่างการเพิ่มข้อมูลผู้ใช้
router.post('/api/insert-user', async (req, res) => {
    console.log('Request Body:', req.body);
    const { profile_name, profile_picture, username, user_password, user_email, user_bio } = req.body;

    if (!profile_name || !username || !user_password || !user_email) {
        return res.status(400).json({ error: "Name, Username, Email, and Password are required" });
    }

    try {
        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const hashedPassword = await bcrypt.hash(user_password, 10);

        // อ่านไฟล์ภาพและแปลงเป็น Buffer
        let profilePictureBuffer = null;
        if (profile_picture) {
            const imagePath = path.join(__dirname, 'uploads', profile_picture);  // ตรวจสอบว่าเส้นทางไฟล์ถูกต้อง
            profilePictureBuffer = fs.readFileSync(imagePath);  // อ่านไฟล์เป็น Buffer
        }

        const query = 
            `INSERT INTO User (profile_name, profile_picture, username, user_password, user_email, user_bio)
            VALUES (?, ?, ?, ?, ?, ?)`;

        connection.query(
            query,
            [profile_name, profilePictureBuffer, username, hashedPassword, user_email, user_bio || null],
            (err, results) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ error: "Internal Server Error", details: err.message });
                }
                res.json({ msg: "User registered successfully", insertedId: results.insertId });
            }
        );
    } catch (err) {
        console.error("Error hashing password:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// -----------------------------------------------------------------------------------
router.post('/api/insert-post', upload.single('post_picture'), (req, res) => {
    const { user_ID, post_topic, date, time } = req.body;
    const post_picture = req.file ? req.file.buffer : null;

    if (!user_ID || !post_topic || !date || !time) {
        return res.status(400).json({ error: "User ID, post topic, date, and time are required" });
    }

    const checkUserQuery = "SELECT * FROM User WHERE user_ID = ?";
    connection.query(checkUserQuery, [user_ID], (err, results) => {
        if (err) {
            console.log("Error checking user existence: ", err);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: "User ID does not exist" });
        }

        const query = "INSERT INTO Post (user_ID, post_topic, post_picture, date, time) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [user_ID, post_topic, post_picture, date, time], (err, results) => {
            if (err) {
                console.log("Error inserting data into Post table: ", err);
                return res.status(500).json({ error: "Internal Server Error", details: err.message });
            }

            res.json({
                msg: "Post inserted successfully",
                insertedId: results.insertId
            });
        });
    });
});

// -----------------------------------------------------------------------------------

router.post('/api/insert-process', upload.single('process_picture'), (req, res) => {
    const { recipe_ID, no_step, process_describe } = req.body;
    const process_picture = req.file ? req.file.buffer : null;

    if (!recipe_ID || !no_step || !process_describe) {
        return res.status(400).json({ error: "Recipe ID, step number, and process description are required" });
    }

    const query = "INSERT INTO Process(recipe_ID, process_picture, no_step, process_describe) VALUES (?, ?, ?, ?)";
    connection.query(query, [recipe_ID, process_picture, no_step, process_describe], (err, results) => {
        if (err) {
            console.log("Error inserting data into Process table: ", err);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        res.json({
            msg: "Process step inserted successfully",
            insertedId: results.insertId
        });
    });
});

// -----------------------------------------------------------------------------------
router.post('/api/insert-ingredient', (req, res) => {
    const { recipe_ID, ingredient_name, ingredient_amount } = req.body;

    if (!recipe_ID || !ingredient_name || !ingredient_amount) {
        return res.status(400).json({ error: "Recipe ID, ingredient name, and ingredient amount are required" });
    }

    const query = "INSERT INTO Ingredient(recipe_ID, ingredient_name, ingredient_amount) VALUES (?, ?, ?)";
    connection.query(query, [recipe_ID, ingredient_name, ingredient_amount], (err, results) => {
        if (err) {
            console.log("Error inserting data into Ingredient table: ", err);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        res.json({
            msg: "Ingredient inserted successfully",
            insertedId: results.insertId
        });
    });
});

// -----------------------------------------------------------------------------------

router.post('/api/insert-process', (req, res) => {
    const { recipe_ID, process_picture, no_step, process_describe } = req.body;

    if (!recipe_ID || !no_step || !process_describe) {
        return res.status(400).json({ error: "Recipe ID, step number, and process description are required" });
    }

    const query = "INSERT INTO Process(recipe_ID, process_picture, no_step, process_describe) VALUES (?, ?, ?, ?)";
    connection.query(query, [recipe_ID, process_picture || null, no_step, process_describe], (err, results) => {
        if (err) {
            console.log("Error inserting data into Process table: ", err);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        res.json({
            msg: "Process step inserted successfully",
            insertedId: results.insertId // ค่า ID ที่สุ่ม
        });
    });
});

// register login post recipe ingredient process 

module.exports = router;  

