const express = require('express');
const router = express.Router();
const post = require('../models/postModel');
const Auth = require('../middleware/checkAuth');
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

router.post('/', Auth, multer({ storage: storage }).single('image'), async(req, res, next) => {
    // console.log(req.body);

    const url = req.protocol + '://' + req.get("host");
    // console.log(req.userData.userId);
    newPost = new post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
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
    const pageSize = +req.query.pageSize;
    const pageIndex = +req.query.pageIndex;
    let posts;
    if (pageSize && pageIndex) {
        posts = await post.find().skip(pageSize * (pageIndex - 1))
            .limit(pageSize);
    } else {
        posts = await post.find();
    }
    const cnt = await post.countDocuments();
    res.status(200).json({ message: "Get posts done", posts: posts, count: cnt });
});

router.get('/:id', async(req, res, next) => {
    posts = await post.findById(req.params.id);
    res.status(200).json({ message: "Get one posts done", posts: posts });
});

router.put('/:id', Auth, multer({ storage: storage }).single('image'), async(req, res, next) => {
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
        imagePath: imagePath,
        creator: req.userData.userId
    });
    const result = await post.findOneAndUpdate({ _id: req.params.id, creator: req.userData.userId }, newPost);
    if (result != null) {
        res.status(200).json({ message: "update successful", post: newPost });
    } else {
        res.status(401).json({ message: "auth fail", post: null });
    }
});

router.delete('/:id', Auth, async(req, res, next) => {
    const result = await post.findOneAndDelete({ _id: req.params.id, creator: req.userData.userId });
    if (result != null) {
        res.status(200).json({ message: "post deleted" });
    } else {
        res.status(401).json({ message: "auth fail" });
    }

});

module.exports = router;