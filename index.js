const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const connectDB = require("./config/db");
const authRoute = require("./routes/auth");
const newsRoute = require("./routes/news");
const uploadRoute = require("./routes/uploadRoute");
const blogsRoute = require("./routes/blogs");

const path = require("path");

const app = express();

//=================>MiddleWare<==================
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5000",
      "http://localhost:5173",
      "https://servey-densovan.vercel.app",
      "https://servey.vercel.app",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ msg: "Hello world" });
});

//====================>authRouter<===================
app.use("/api", authRoute);
//====================>newsRouter<==================
app.use("/api/news", newsRoute);
//====================>blogRoute<=================
app.use("/api/blogs", blogsRoute);
//====================>Upload file<==================
app.use("/api/upload", uploadRoute);
app.use(express.static("uploads"));
// const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//==============connect database==============
connectDB();

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server Runing on Port : ${PORT}`.bgRed));
