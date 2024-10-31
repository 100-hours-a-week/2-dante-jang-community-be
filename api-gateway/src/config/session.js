const session = require("express-session");
const RedisStore = require("connect-redis").default; // 'default'로 접근

const redisClient = require("./redis"); // redis 클라이언트를 따로 설정했다면 불러오기

const sessionConfig = session({
  store: new RedisStore({ client: redisClient }), // redis 클라이언트와 함께 store 설정
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24시간
  },
});

module.exports = sessionConfig;