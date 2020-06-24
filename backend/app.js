const express = require('express');
const app = express();

app.use('/api/posts', (req, res, next) => {
    posts = [{
            _id: "dbasjkb",
            title: "first",
            content: "first content"
        },
        {
            _id: "hnskcnsdgo ",
            title: "first",
            content: "first content"
        }
    ];
    res.status(200).json({ message: "Get posts done", posts: posts });
});

module.exports = app;