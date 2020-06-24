const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-with,Content-Type,Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
    next();
})

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