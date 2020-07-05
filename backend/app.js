const express = require('express');
const app = express();
const posts = require('./routes/posts');
const Users = require('./routes/user');
const path = require('path');
const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://jay:jk@mongocluster-izqv5.mongodb.net/MeanStacks?w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("database connected");
    });
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-with,Content-Type,Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join('backend/images')));

app.use('/api/posts', posts);
app.use('/api/users', Users);

module.exports = app;