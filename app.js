// .env konfigurieren 
require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
// help us to grap the cookies from the browser to synchronised the data from the loged user (store the sesssion)
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');



const connectDB = require('./server/config/db');

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

// Middleware to get the Post from the SearchTerm
app.use(express.urlencoded({ extended: true }));
// Pass data in json 
app.use(express.json());
app.use(methodOverride('_method'));

app.use(cookieParser());
// for the cookies
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
}))




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