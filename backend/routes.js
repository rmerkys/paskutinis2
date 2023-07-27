const express = require("express");
const ownerGuard = require("./middlewares/auth/guards/owner.guard.js");
const participantController = require("./controllers/participant.controller.js");
const adminController = require("./controllers/admin.controller.js");

const routes = (app) => {
  app.use(express.json());
  app.use("/participants", participantController);
  app.use("/admins", ownerGuard);
  app.use("/admins", adminController.router);
};

module.exports = routes;
