const { createClient } = require("redis");
require('dotenv').config();
const { REDIS_URL } = process.env;

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

module.exports = redisClient;
