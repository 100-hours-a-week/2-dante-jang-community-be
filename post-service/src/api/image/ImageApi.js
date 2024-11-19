const axios = require('axios');
const GetImageResponseDto = require('./response/GetImageResponseDto');
const ResponseDto = require('../ResponseDto');
require('dotenv').config();

const baseUrl = `${process.env.IMAGE_SERVER_URL}/api/v1/images`;

const GET_IMAGE_URL = (imageId) => `${baseUrl}/${encodeURIComponent(imageId)}`;
const DELETE_IMAGE_URL = (imageId) => `${baseUrl}/${encodeURIComponent(imageId)}`;

const getImageRequest = async (imageId) => {
    try {
        const response = await axios.get(GET_IMAGE_URL(imageId));
        const responseBody = new GetImageResponseDto(response.data.url);
        return responseBody;
    } catch (error) {
        console.error(`Error get image ${imageId}:`, error);
        return null;
    }
};

const deleteImageRequest = async (imageId) => {
    try {
        const response = await axios.delete(DELETE_IMAGE_URL(imageId));
        const responseBody = new ResponseDto(response.data.message);
        return responseBody;
    } catch (error) {
        console.error(`Error delete image ${imageId}:`, error);
        return null;
    }
}

module.exports = {getImageRequest, deleteImageRequest};