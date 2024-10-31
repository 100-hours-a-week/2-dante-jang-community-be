const axios = require('axios');

const baseUrl = "http://localhost:9001/user";

exports.fetchUser = async (userId) => {
    try {
        const response = await axios.get(`${baseUrl}/internal`, { params: { userId } });
        return [response.data.name, response.data.profile_url];
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return null;
    }
};
