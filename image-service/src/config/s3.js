const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

const { AWS_BUCKET_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

const s3Client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
});

module.exports = { s3Client, PutObjectCommand, DeleteObjectCommand };