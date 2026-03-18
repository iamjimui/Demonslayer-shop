module.exports = app => {
  const users = require("../controllers/UserController.js");

  var router = require("express").Router();

  router.get("/users", users.getUsers);

  router.post("/register", users.register);

  router.get("/me", users.me);

  router.post("/login", users.login);

  router.put("/user/:username", users.updateUser);

  router.post("/picture/:username", users.updateUserImage);

  router.get("/user/:username", users.getUser);

  router.delete("/user/:username", users.deleteUser);

  app.use("", router);
};