const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


/**
 * GET / 
 * Post: id
*/
router.get('/post/:id', async (req, res) => {
    try {
        // grabs ID
        let slug = req.params.id

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Simple Blog created"
        }

        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST / 
 * Post: seachTerm
*/
router.post('/search', async (req, res) => {

    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created"
        }

        let searchTerm = req.body.searchTerm;
        // Removes special characters
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        // get the post by the search withput the special characters
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });


        res.render("search", { data, locals });

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;