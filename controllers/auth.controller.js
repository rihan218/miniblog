const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// --- register user ---

const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const extingUser = await userModel.findOne({ email });
    if (extingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, username: newUser.username },
      "Rihan1234",
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(`Error in registerUser: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

//---Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Fount! Please signUp" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Invalid Password! Please try again" });
    }
    const token = jwt.sign(
      { email: user.email, username: user.username },
      "Rihan1234",
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "User successfully Logedin " });
  } catch (error) {
    console.log(`Error in loginUser: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

//---logOut user
const logOutUser = async (req, res) => {
  try {
    res.cookie("token", "");
    res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

//---protected route

const authenticatedUser = async (req, res, next) => {
  if (req.cookies.token === "") {
    res.status(401).send(" please log in first");
  }
  try {
    const decode = jwt.verify(req.cookies.token, "Rihan1234");
    req.user = decode;
    next();
  } catch (error) {
    return res.send("Token not recieved");
  }
};
module.exports = { registerUser, loginUser, logOutUser, authenticatedUser };
