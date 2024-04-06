const redis = require("redis");
const redisClient = redis.createClient(6379);

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connection successful!");
  } catch (error) {
    console.error("Redis connection error:", error);
    // Handle connection errors gracefully
  }
};

redisClient.on("error", (err) => console.log("Redis Client Error", err));
module.exports = { connectRedis, redisClient }; // module.exports = redisClient;
// (async () => {
//   redisClient.on("error", (err) => {
//     console.log("Redis Client Error", err);
//   });
//   redisClient.on("ready", () => console.log("Redis is ready"));

//   await redisClient.connect();

//   await redisClient.ping();
// })();
