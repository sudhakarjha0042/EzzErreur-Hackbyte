const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("token is ", token);
  console.log(process.env.JWT_SECRET);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("error while verifying token is ", err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.userId = decoded.userId; // Extract userId from decoded token and sending it to Createprofile function
    console.log(req.userId, "+", decoded);
    next();
  });
};

const verifyModerator = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("error while verifying token is ", err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    // Assuming you have a field in the token payload to identify the role
    if (decoded.role !== "Moderator") {
      return res.status(403).json({ error: "Forbidden: Not a moderator" });
    }
    req.userId = decoded.userId;
    next();
  });
};

const verifyOwner = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("error while verifying token is ", err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    // Assuming you have a field in the token payload to identify the role
    if (decoded.role !== "Owner") {
      return res.status(403).json({ error: "Forbidden: Not an owner" });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyUser, verifyModerator, verifyOwner };
