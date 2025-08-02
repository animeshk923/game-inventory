const { Router } = require("express");
const controller = require("../controllers/index");
const appRoute = Router();

appRoute
  .get("/", controller.indexPageGet)
  .get("/:studioId", controller.getGamesByStudioId);

module.exports = appRoute;
