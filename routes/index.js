const { Router } = require("express");
const controller = require("../controllers/index");
const appRoute = Router();

appRoute
  .get("/", controller.indexPageGet)
  .get("/studio/:studioId", controller.getGamesByStudioId)
  .get("/category/:categoryId", controller.getGamesByCategoryId)
  .get("/addGame", controller.addGamesGet)
  .post('/addGame', controller.addGamesPost)
  .get('/deleteAllData', controller.deleteAllDataPost); // remaining feature, implement later

module.exports = appRoute;
