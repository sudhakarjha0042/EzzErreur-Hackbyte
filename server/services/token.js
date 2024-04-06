const jwt = require("jsonwebtoken");

const secret_key = process.env.JWT_SECRET;
console.log(`Secret key is ${secret_key}`);

const generateToken = (user) => {
  console.log("user is ", user);
  return jwt.sign({ userId: user._id }, secret_key, { expiresIn: "1000h" });
};

const verifyToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, secret_key);
    return decodedToken;
  } catch (err) {
    throw err;
  }
};

module.exports = { generateToken, verifyToken };
