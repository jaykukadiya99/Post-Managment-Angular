const express = require('express');
const router = express.Router();
const post = require('../models/postModel');
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error('Invalid mime type');
        if (isValid) {
            err = null
        }
        cb(err, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + ext);
    }
});

router.post('/', multer({ storage: storage }).single('image'), async(req, res, next) => {
    // console.log(req.body);

    const url = req.protocol + '://' + req.get("host");

    newPost = new post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });

    await newPost.save();

    res.status(201).json({
        message: "post added",
        post: {
            ...newPost,
            id: newPost._id,
        }
    });
});

router.get('/', async(req, res, next) => {
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

router.get('/:id', async(req, res, next) => {
    posts = await post.findById(req.params.id);
    res.status(200).json({ message: "Get one posts done", posts: posts });
});

router.put('/:id', multer({ storage: storage }).single('image'), async(req, res, next) => {
    let url
    let imagePath = req.body.imagePath;
    if (req.file) {
        url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }

    const newPost = new post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    const result = await post.findByIdAndUpdate(req.params.id, newPost);
    res.status(200).json({ message: "update successful", post: newPost });
});

router.delete('/:id', async(req, res, next) => {
    await post.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "post deleted"
    })
});

module.exports = router;