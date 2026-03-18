module.exports = app => {
  const comments = require("../controllers/CommentController.js");

  var router = require("express").Router();

  router.get("/comments", comments.getComments);

  router.get("/comments/:username", comments.getUserComments);

  router.get("/comments/product/:productId", comments.getAllCommentsFromProduct);

  router.post("/comment/:productId", comments.createComment);

  router.put("/comment/:commentId", comments.editComment);

  router.delete("/comment/:commentId", comments.deleteComment);

  app.use("", router);
};