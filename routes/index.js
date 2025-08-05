const { Router } = require("express");
const controller = require("../controllers/index");
const appRoute = Router();

appRoute
  .get("/", controller.indexPageGet)
  .get("/studio/:studioId", controller.getGamesByStudioId)
  .get("/category/:categoryId", controller.getGamesByCategoryId)
  .get("/addGame", controller.addGamesPost);

module.exports = appRoute;
