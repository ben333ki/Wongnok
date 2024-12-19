const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const router = express.Router();
const port = 3000;

router.use(cors()); 

router.use(express.json());

router.use(cors({
    origin: '*',  
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
router.post('/api/insert', (req, res) => {
    const { profile_name, profile_picture, username, user_password, user_email, user_bio } = req.body;

    if (!profile_name || !profile_picture || !username || !user_password || !user_email || !user_bio) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO User(profile_name, profile_picture, username, user_password, user_email, user_bio) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, [profile_name, profile_picture, username, user_password, user_email, user_bio], (err, results) => {
        if (err) {
            console.log("Error inserting data: ", err);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        res.json({
            msg: "Data inserted successfully",
            insertedId: results.insertId // ค่า ID ที่สุ่ม
        });
    });
});

// -----------------------------------------------------------------------------------
router.post('/api/insert-post', (req, res) => {
    const { user_ID, post_topic, post_picture, date, time } = req.body;
    
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
        connection.query(query, [user_ID, post_topic, post_picture || null, date, time], (err, results) => {
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
router.post('/api/insert-recipe', (req, res) => {
    const { post_ID, recipe_name, recipe_type } = req.body;

    if (!post_ID || !recipe_name || !recipe_type) {
        return res.status(400).json({ error: "Post ID, recipe name, and recipe type are required" });
    }

    const query = "INSERT INTO Recipe(post_ID, recipe_name, recipe_type) VALUES (?, ?, ?)";
    connection.query(query, [post_ID, recipe_name, recipe_type], (err, results) => {
        if (err) {
            console.log("Error inserting data into Recipe table: ", err);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        res.json({
            msg: "Recipe inserted successfully",
            insertedId: results.insertId // ค่า ID ที่สุ่ม
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
            insertedId: results.insertId // ค่า ID ที่สุ่ม
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


module.exports = router;