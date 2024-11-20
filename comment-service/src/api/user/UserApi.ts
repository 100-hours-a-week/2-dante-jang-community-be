import axios from "axios";
require('dotenv').config();

const baseUrl = `${process.env.USER_SERVER_URL}/api/v1/users`;

const FETCH_USER_URL = (userId: number) => `${baseUrl}/${encodeURIComponent(userId)}`;

export const fetchUserRequest = async (userId : number) => {
    try {
        const response = await axios.get(FETCH_USER_URL(userId));
        return response.data.user;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return null;
    }
}