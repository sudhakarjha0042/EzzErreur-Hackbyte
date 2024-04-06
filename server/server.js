const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/User_route");
const postRoutes = require("./routes/Code_route");
const exploredpageRoutes = require("./routes/Explore_route");
const connectDB = require("./config/dbConnection");

require("dotenv").config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// HTML file for testing the socket
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Routes setup
app.use("/users", userRoutes);
app.use("/codes", postRoutes);
app.use("/explore", exploredpageRoutes);

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
