// .env konfigurieren 
require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

// Middleware to get the Post from the SearchTerm
app.use(express.urlencoded({ extended: true }));
// Pass data in json 
app.use(express.json());




// Adding sources (css, js, ...)
app.use(express.static('public'));

// Templating Engine (Middleware)
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Including main.js
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});