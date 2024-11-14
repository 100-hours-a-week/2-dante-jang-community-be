const session = require("express-session");
const RedisStore = require("connect-redis").default;
require('dotenv').config();
const { SESSION_SECRET_KEY } = process.env;

const redisClient = require("./redis");

const sessionConfig = session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 604800000,
  },
});

module.exports = sessionConfig;