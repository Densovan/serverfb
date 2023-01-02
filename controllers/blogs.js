const Blogs = require("../models/blogs");
const User = require("../models/user");

// @desc    Add new Blogs
// @route   POST/api/blogs
// @access  Private
exports.addBlogs = async (req, res) => {
  try {
    const { title, thumnail, des } = req.body;

    const blogs = new Blogs({
      title,
      thumnail,
      des,
      user: req.user._id,
    });
    await blogs.save();
    return res.status(200).json({ message: "Created Blogs Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// @desc    Edit Blogs
// @route   PUT/api/blogs/:id
// @access  Private

exports.updateBlogs = async (req, res) => {
  try {
    const { title, thumnail, des } = req.body;
    const blogs = await Blogs.findById(req.params.id);
    if (blogs) {
      const updateBlogs = {
        title,
        thumnail,
        des,
      };
      await Blogs.findByIdAndUpdate({ _id: req.params.id }, updateBlogs);
      return res
        .status(200)
        .json({ msg: "Updated Successfully", updateBlogs: updateBlogs });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};

//@route DELETE/api/blogs/:id
//@desc delete blogs
//@access Private

exports.deleteBlogs = async (req, res) => {
  try {
    const existAdmin = await User.findOne({ user: req.user.id });
    if (existAdmin) {
      const blogs = await Blogs.findById(req.params.id);
      //Check for blogs owner
      if (blogs.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorize" });
      } else {
        //Delete
        await blogs.remove();
        return res.status(200).json({ msg: "Deleted Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};

//@route GET/api/blogs/
//@desc Fetch all blogs
//@access Public

exports.allBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({})
      .sort({ created_at: -1 })
      .populate("user", "fullname");
    res.json(blogs);
  } catch (error) {
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};

//@route GET/api/blogs/:id
//@desc Fetch a blogs
//@access Public
exports.getBlogsbyId = async (req, res) => {
  try {
    const blogs = await Blogs.findById(req.params.id);
    if (blogs) {
      res.json(blogs);
    } else {
      res.status(404).json({ msg: "News not Found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "server Error", error: error.message });
  }
};
