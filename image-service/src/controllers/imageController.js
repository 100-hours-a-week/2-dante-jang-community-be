const pool = require('../config/db');
require('dotenv').config();
const { AWS_BUCKET_NAME, AWS_BUCKET_REGION } = process.env;
const s3 = require('../config/s3');

exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const file = req.file

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const command = new s3.PutObjectCommand(params);
        await s3.s3Client.send(command);

        const imageUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${params.Key}`;
        const [result] = await pool.execute("INSERT INTO `image` (url) VALUES (?)", [imageUrl]);

        res.status(201).json({ image_id: result.insertId, url: imageUrl });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
    }
}

exports.getImage = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute("SELECT * FROM `image` WHERE image_id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).json({ error: "Failed to retrieve image" });
    }
};

exports.updateImage = async (req, res) => {
    const { id } = req.params;
    
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const [rows] = await pool.execute("SELECT url FROM `image` WHERE image_id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        const oldImageUrl = rows[0].url;
        const oldKey = oldImageUrl.split('/').pop();

        const newParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        const newCommand = new s3.PutObjectCommand(newParams);
        await s3.s3Client.send(newCommand);

        const deleteCommand = new s3.DeleteObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: oldKey,
        });
        await s3.s3Client.send(deleteCommand);

        const newImageUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${newParams.Key}`;
        await pool.execute("UPDATE `image` SET url = ? WHERE image_id = ?", [newImageUrl, id]);

        res.status(200).json({ image_id: id, url: newImageUrl });
    } catch (error) {
        console.error("Error updating image:", error);
        res.status(500).json({ error: "Failed to update image" });
    }
};

exports.deleteImage = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute("SELECT url FROM `image` WHERE image_id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        const imageUrl = rows[0].url;
        const key = imageUrl.split('/').pop();

        const deleteCommand = new s3.DeleteObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: key,
        });
        await s3.s3Client.send(deleteCommand);

        await pool.execute("DELETE FROM `image` WHERE image_id = ?", [id]);

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: "Failed to delete image" });
    }
};