const axios = require('axios');
const FecthUserResponseDto = require('./response/FechUserResponseDto');
require('dotenv').config();

const baseUrl = `${process.env.USER_SERVER_URL}/api/v1/users`;

const FETCH_USER_URL = (userId) => `${baseUrl}/${encodeURIComponent(userId)}`;

const fetchUserRequest = async (userId) => {
    try {
        const response = await axios.get(FETCH_USER_URL(userId));
        const responseBody = new FecthUserResponseDto(response.data.user);
        return responseBody;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return null;
    }
};

module.exports = fetchUserRequest;