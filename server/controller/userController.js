const Usermodel = require("../models/UserModel");
const Profilemodel = require("../models/ProfileModel");
const nodemailer = require("nodemailer");
const { transporter } = require("../services/mail");
const { generateToken } = require("../services/token");
const { hashPassword } = require("../services/crypt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// redis import
// const { redisClient } = require("../config/redisConnection");
const checkField = async (req, res) => {
  const { email, username } = req.body;
  try {
    // Check if either phone number or email exists in the database
    const user = await Usermodel.findOne({
      $or: [, { email }, { username }],
    });

    if (user) {
      // If user exists, return a response indicating existence
      res.json({ exists: true });
    } else {
      // If user does not exist, return a response indicating non-existence
      res.json({ exists: false });
    }
  } catch (error) {
    // If an error occurs, return an error response
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  console.log("another function is working");

  const { email, firstName, lastName, username, password } = req.body;

  console.log(email, firstName, lastName, username, password);

  if (!email || !firstName || !lastName || !username || !password) {
    return res.status(400).json({ error: "All fields are mandatory!" });
  }

  try {
    // Check if username already exists
    const existingUsername = await Usermodel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already  exists!" });
    }

    const hashedPassword = await hashPassword(password);

    // Creating user
    const user = await Usermodel.create({
      email,
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      token: token,
      firstname: user.firstName,
      lastname: user.lastName,
      password: user.password,
      username: user.username,
      id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

// checkiing username

// Making profile function
const createProfile = async (req, res) => {
  const userId = req.userId;
  const { following, receivePushNotification, shareLocationtoapp } = req.body;
  console.log(userId, following);

  try {
    const user = await Usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = await Profilemodel.create({
      user,
    });

    const followObjects = [];

    res.status(200).json({
      message:
        "profile created along with all the follow objects and the setting  model for the user",
      success: true,
      profile: profile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await Usermodel.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid username or password - nor exist" });
    }
    console.log("Plaintext password:", password);
    console.log("Hashed password:", user.password);
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Password is valid, user is authenticated
    const token = generateToken(user);
    // following lines are being commented for integration
    // await redisClient.set("name", "Rohit Ghosh");
    // const value = await redisClient.get("name");
    // console.log("name retrieved from the redis database is ", value);
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      user: user,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Email sending function
const sendEmail = async (to, subject, text) => {
  console.log("to is", to);

  let mailOptions = {
    from: `Rohit Ghosh  <${process.env.EMAIL_MAIL}>`,
    to: ` Reciever ${to}`,
    subject: subject,
    text: text,
  };

  console.log(mailOptions);

  await transporter.sendMail(mailOptions);
};

// Generate OTP
let otpStorage = {};
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Function for sending OTP
const takeEmailSendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Entering email is compulsory!" });
  }

  try {
    // Check if email already exists
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const otp = generateOTP();
    otpStorage[email] = otp;
    console.log(
      "otpstorage[email] in the sendEmail function is ",
      otpStorage[email]
    );

    await sendEmail(
      email,
      "Content Match OTP Verification",
      `Your OTP is: ${otp}`
    );
    res.status(200).json({
      message: "OTP sent successfully",
      otp,
      otpStorage,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send OTP", err });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(otp);
  console.log(otpStorage);
  // Retrieve the stored OTP for the given email
  const storedOTP = otpStorage[email];
  console.log("stored otp in the verifyOtp is ", otpStorage[email]);

  if (!otpStorage[email] || otpStorage[email] !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }
  res.status(200).json({ message: "OTP verified successfully" });
};

// update the user profile
// const updateUser = async (req, res) => {
//   console.log("update controller function is working");
//   const userId = req.userId; // Assuming you're passing userId as a parameter in the URL
//   const updateFields = req.body; // Assuming the frontend sends only the fields to be updated

//   try {
//     const user = await Usermodel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Define the allowed fields that can be updated
//     const allowedFields = [
//       "email",
//       "Dob",
//       "location",
//       "password",
//     ];

//     // Update only the allowed fields
//     for (let field in updateFields) {
//       if (allowedFields.includes(field)) {
//         user[field] = updateFields[field];
//       }
//     }

//     // Save the updated user document
//     const updatedUser = await user.save();

//     res.status(200).json({
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error });
//   }
// };

const redisCheck = async (req, res) => {
  await redisClient.set("line", "Rohit Ghosh is working  on the content app");
  const response = await redisClient.get("line");
  res.json({
    res: response,
  });
};

const logout = async (req, res) => {
  // await redisClient.set("line", "Rohit Ghosh is working  on the content app");
  // const response = await redisClient.get("line");
  res.json({
    res: "logout",
  });

  // function for getting the user when the user opens the app
};

const getUserProfile = async (req, res) => {
  console.log("get profile unc");
  const userId = req.userId;
  console.log(userId);
  const profile = await Profilemodel.findOne({
    user: userId,
  }).populate("user");
  if (!profile) {
    return res.status(404).json({ message: "User profile not found" });
  }
  // If the profile exists, send the profile data
  res.status(200).json({
    profile: profile,
    // user: profile.user.firstName,
  });
};

const updateUser = async (req, res) => {
  const userId = req.userId; // Assuming you have a userId parameter in your route
  const updatedFields = req.body; // Fields to be updated
  console.log(updatedFields);
  try {
    const user = await Usermodel.findById(userId);
    if (!user) {
      res.json("User not found");
    } else {
      for (let field in updatedFields) {
        console.log("field is", field);
        user[field] = updatedFields[field];
      }
      const updatedUser = await user.save();
      res.json(updatedUser);
    }

    // If the update is successful, return the updated user object
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRandomUserProfile = async (req, res) => {
  const { randomProfileId } = req.query;
  try {
    const userProfile = await Profilemodel.findById(randomProfileId).populate(
      "user"
    );
    console.log(userProfile);
    res.status(200).json({ userProfile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  checkField,
  createUser,
  createProfile,
  getUserProfile,
  takeEmailSendOtp,
  verifyOtp,
  login,
  updateUser,
  logout,
  redisCheck,
  getRandomUserProfile,
};
