const express = require("express");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = express.Router();

const {
  addBlogs,
  allBlogs,
  deleteBlogs,
  getBlogsbyId,
  updateBlogs,
} = require("../controllers/blogs");

router.route("/").post(auth, admin, addBlogs).get(allBlogs);
router
  .route("/:id")
  .delete(auth, admin, deleteBlogs)
  .put(auth, admin, updateBlogs)
  .get(getBlogsbyId);
module.exports = router;
