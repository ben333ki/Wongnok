const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/user');
const bodyParser = require('body-parser');


// Middleware to serve static files and parse request bodies
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Set up views and template engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('testIndex', { message:'Home', isLogin:'No login' });
});



app.get('/create', (req, res) => {
    res.render('user/create/create');
});

app.get('/register', (req, res) => {
    res.render('testRegister');
});

app.post('/register', function(req, res) {
    const newUser = new User({
        name: req.body.name,  // Extract 'name' from the form
        email: req.body.email, // Extract 'email' from the form
        password: req.body.password // Extract 'password' from the form
    });

    newUser.save()
        .then(() => {
            console.log('User successfully saved!');
            res.redirect('/'); // Redirect to the homepage after saving
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Failed to save user');
        });
});



app.get('/users', (req, res) => {
    User.find({})
        .then(users => {
            res.render('testUsers', { users }); // Pass the 'users' array to the EJS view
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error retrieving users from the database');
        });
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
