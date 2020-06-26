const express = require('express');
const app = express();
const post = require('./models/postModel');

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-with,Content-Type,Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/posts', async(req, res, next) => {
    // console.log(req.body);
    newPost = new post({
        title: req.body.title,
        content: req.body.content
    });

    await newPost.save();

    res.status(201).json({
        message: "post added",
        postId: newPost._id
    });
});

app.get('/api/posts', async(req, res, next) => {
    // posts = [{
    //         _id: "dbasjkb",
    //         title: "first",
    //         content: "first content"
    //     },
    //     {
    //         _id: "hnskcnsdgo ",
    //         title: "first",
    //         content: "first content"
    //     }
    // ];
    posts = await post.find({});
    res.status(200).json({ message: "Get posts done", posts: posts });
});

app.delete('/api/posts/:id', async(req, res, next) => {
    await post.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "post deleted"
    })
})

module.exports = app;