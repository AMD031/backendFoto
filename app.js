const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
const cors = require('cors');
require('dotenv').config();
app.use(cors());


const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {});
        console.log(uploadResponse);
        res.json({ res: uploadResponse});
    } catch (err) {
        res.status(500).json({ err });
    }
});

app.delete('/api/delete',  async (req, res) => {
    try {
        const data = req.body.data;
        console.log('dato:',data);  
        await cloudinary.uploader.destroy(data, function(error,result) {
        // console.log(result, error)
     });
        res.json({ msg: 'ok' });
    } catch (err) {
        res.status(500).json({ err });
    }

 })


app.get("/", (request, response) => {
    response.json({ message: "funciona" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});