module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");
  const {CompletedTxController} = require("../controllers");
  var router = require("express").Router();

  // Create a new Tutorial
  router.get("/Address", CompletedTxController.find);

  // Retrieve all Tutorials
  router.get("/", CompletedTxController.findAll);

  app.use("/api", router);
};
