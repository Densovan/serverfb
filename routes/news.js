const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const {
  addNews,
  deleteNews,
  allNews,
  getNewsbyId,
  updateNews,
} = require("../controllers/news");

router.route("/").post(auth, addNews).get(allNews);
router
  .route("/:id")
  .delete(auth, deleteNews)
  .put(auth, updateNews)
  .get(getNewsbyId);
module.exports = router;
