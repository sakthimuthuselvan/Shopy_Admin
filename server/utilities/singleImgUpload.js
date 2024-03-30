
const express = require("express");
const route = express();
const mongoose = require('mongoose');
const { upload } = require("../uploadMiddleware");

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String
    }
});
const Image = mongoose.model('Image', imageSchema);

route.post('/', upload.single('image'), async (req, res) => {
    console.log("req.file ",req.file);
    try {
        const imageUrl = `${req.file.path}`;
        const newImage = new Image({ imageUrl });
        await newImage.save();
        res.status(201).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ response_type:"failure", error_response: 'Failed to upload image' });
    }
});


module.exports = route;