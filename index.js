const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Directorio Público
app.use(express.static('public'));
const cloudinary = require('cloudinary').v2;
// const { json } = require('express');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.get('/api/get/:id', async (req, res) => {
    const data = req.params.id+'';
    try {
        cloudinary.api.resources_by_ids([data],
            (error, result) => {
                res.json({ result });
            });

    } catch (err) {
        res.status(500).json({ err });
    }


});

app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            overwrite: true,
            invalidate: true,
            // width: 810, height: 456, crop: "fill"
        });
        res.json({ res: uploadResponse });
    } catch (err) {
        res.status(500).json({ err });
    }
});

app.delete('/api/delete/:id', async (req, res) => {
    try {
        const data = req.params.id;
        await cloudinary.uploader.destroy(data, function (error, result) {
            if (result) {
                res.json({ msg: 'ok' });
            }
        });
    } catch (err) {
        res.status(500).json({ err });
    }
})

app.put('/api/update', async (req, res) => {
    try {
        const imgkey = req.body.data.imgkey;
        const img = req.body.data.img;
        console.log(imgkey, '', img);
        await cloudinary.uploader.destroy(imgkey, async (error, result) => {
            if (result) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(img, {});
                    res.json({ res: uploadResponse });
                } catch (err) {
                    res.status(500).json({ err });
                }
            }
        });

    } catch (err) {
        res.status(500).json({ err });
    }
});

app.get("/", (request, response) => {
    response.json({ message: "funciona" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});