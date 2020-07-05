const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    imagePath: String
});

module.exports = mongoose.model("Posts", postSchema);