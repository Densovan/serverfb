const News = require("../models/news");
const User = require("../models/user");

// @desc    Add new News
// @route    POST/api/news
// @access  Private
exports.addNews = async (req, res) => {
  try {
    const { title, thumnail, des } = req.body;

    const news = new News({
      title,
      thumnail,
      des,
      user: req.user._id,
    });
    await news.save();
    return res.status(200).json({ message: "Created News Successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// @desc    Edit News
// @route   PUT/api/news/:id
// @access  Private

exports.updateNews = async (req, res) => {
  try {
    const { title, thumnail, des } = req.body;
    const news = await News.findById(req.params.id);
    if (news) {
      const updateNews = {
        title,
        thumnail,
        des,
      };
      await News.findByIdAndUpdate({ _id: req.params.id }, updateNews);
      return res
        .status(200)
        .json({ msg: "Updated Successfully", updateNews: updateNews });
    }
  } catch (error) {
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};

//@route DELETE/api/news/:id
//@desc delete news
//@access Private

exports.deleteNews = async (req, res) => {
  try {
    const existAdmin = await User.findOne({ user: req.user.id });
    if (existAdmin) {
      const news = await News.findById(req.params.id);
      //Check for news owner
      if (news.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorize" });
      } else {
        //Delete
        await news.remove();
        return res.status(200).json({ msg: "Deleted Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};

//@route GET/api/news/
//@desc Fetch all news
//@access Public

exports.allNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ created_at: -1 });
    res.json(news);
  } catch (error) {
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};

//@route GET/api/news/:/id
//@desc Fetch a news
//@access Public
exports.getNewsbyId = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ msg: "News not Found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};
