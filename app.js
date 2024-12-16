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
const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('user/home', { title: 'Home Page' });
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(path.join(__dirname, 'views', 'partials')); 
    console.log(`Server is running on http://localhost:${PORT}`);
});


