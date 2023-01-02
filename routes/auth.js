const express = require("express");

const router = new express.Router();

const {
  login,
  logout,
  generateAccessToken,
  register,
  get_login,
  fb,
  des,
} = require("../controllers/user");

//=========Login==============

router.post("/login", login);
router.post("/register", register);
router.get("/get_login", get_login);
router.get("/refresh_token", generateAccessToken);
router.get("/logout", logout);
router.post("/fb", fb);
router.post("/des", des);

module.exports = router;
