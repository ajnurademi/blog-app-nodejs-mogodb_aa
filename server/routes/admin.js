const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
// help us for the cookies
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 *  Middleware function (to get us in only if we have logged in)
 * Check Login 
*/
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

/**
 * GET / 
 * Admin - Login Page
*/
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created"
        }

        // !changed the name index --> login
        res.render('admin/login', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/**
 * Post / 
 * Admin - Check Login
*/
router.post('/admin', async (req, res) => {
    try {
        // getting data for login  
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        // save token to cookie
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});

/**
 * Get / 
 * admin dashboard 
*/
router.get('/dashboard', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Dashboard",
            description: "Simple Blog created"
        }
        const data = await Post.find()
        res.render('admin/dashboard', { locals, data, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }

});

/**
 * Get / 
 * admin - Create New Post 
*/
router.get('/add-post', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created"
        }
        const data = await Post.find()
        res.render('admin/add-post', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }

});


/**
 * Post / 
 * admin - Create New Post 
*/
router.post('/add-post', authMiddleware, async (req, res) => {

    try {

        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost)
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }



    } catch (error) {
        console.log(error);
    }

});

/**
 * get / 
 * admin - Create New Post 
*/
router.get('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Edit Post",
            description: "Simple Blog created"
        }
        const data = await Post.findOne({ _id: req.params.id })

        res.render('admin/edit-post', { locals, data, layout: adminLayout });

    } catch (error) {
        console.log(error);
    }

});

/**
 * Delete / 
 * admin - Delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

});

/**
 * Put / 
 * admin - Create New Post 
*/
router.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updateAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }

});

/**
 * Post / 
 * Admin - Register
*/
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'user created', user })
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'user already in use' });
            }
            res.status(500).json({ message: 'Interal Server Error' });
        }


    } catch (error) {
        console.log(error);
    }
});

/**
 * Get / 
 * amin - logout
*/
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'logout succesful.' });
    res.redirect('/');

})

module.exports = router;