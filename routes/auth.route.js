const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logOutUser,
  authenticatedUser,
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/dashboard", authenticatedUser, (req, res) => {
  console.log(req.user);
  res.send("This is admin pannel");
});

module.exports = router;
