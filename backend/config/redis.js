const asyncRedis = require("async-redis");
const REDIS_URL = process.env.REDIS_URL;
const redisClient = asyncRedis.createClient(REDIS_URL);
module.exports = redisClient;
