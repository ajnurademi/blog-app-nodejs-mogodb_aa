// .env konfigurieren 
require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = 5000 || process.env.PORT;

// Adding sources (css, js, ...)
app.use(express.static('public'));

// Templating Engine (Middleware)
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Including main.js
app.use('/', require('./server/routes/main'))

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});