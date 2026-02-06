const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRoutes = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

// --- basic middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//// multer setup........../

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//----- routes ---
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});

/// route multer
app.get("/multer", (req, res) => {
  res.render("multer");
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
});
app.use("/profile", authRoutes);

// --- database connection ---
mongoose
  .connect("mongodb://127.0.0.1:27017/mini-blog")
  .then(() => {
    console.log("MongoDb connection SUCCESSFUL");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => {
    console.log(`MongoDb connection FAILLED: ${err.message}`);
  });

 