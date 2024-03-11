const express = require('express');
const router = express.Router();

// Routes
router.get('', (req, res) => {
    // making data to pass them in .ejs
    const locals = {
        title: "NodeJs Blog",
        description: "Simple Blog created"
    }



    res.render('index', {locals});
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;