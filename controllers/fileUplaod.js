require("dotenv").config();
const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
//import upload file
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();
const storage = multer.memoryStorage();

var upload = multer({
  storage,
  // limits: { fileSize: 2 * 1024 * 1024 },
});

// Upload Image
router.post("/upload/image", upload.single("thumbnail"), async (req, res) => {
  fs.access("./public/uploads/", (error) => {
    if (error) {
      fs.mkdirSync("./public/uploads/");
    }
  });
  const { buffer } = req.file;
  const ref = `${uuidv4()}.jpg`;
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile("./public/uploads/" + ref);
  return res.json({
    // imageUrl: `https://backend.sdacharn.com/public/uploads/${ref}`,
    imageUrl: `http://localhost:9090/public/uploads/${ref}`,
  });
});
