const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://jay:jk@mongocluster-izqv5.mongodb.net/MeanStacks?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("database connected");
    });

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

module.exports = mongoose.model("Posts", postSchema);