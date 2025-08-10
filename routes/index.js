const { Router } = require("express");
const controller = require("../controllers/index");
const appRoute = Router();

// indexing
appRoute
  .get("/", controller.indexPageGet)
  .get("/studio/:studioId", controller.getGamesByStudioId)
  .get("/category/:categoryId", controller.getGamesByCategoryId);

// Add functionalities
appRoute
  .get("/addGame", controller.addGamesGet)
  .post("/addGame", controller.addGamesPost)
  .get("/addStudio", controller.addStudioGet)
  .post("/addStudio", controller.addStudioPost)
  .get("/addCategory", controller.addCategoryGet)
  .post("/addCategory", controller.addCategoryPost);

// Update functionalities
appRoute
  .get("/editGame", controller.updateGameGet)
  .post("/editGame", controller.updateGamePost)
  .get("/editStudio", controller.updateStudioGet)
  .post("/editStudio", controller.updateStudioPost)
  .get("/editCategory", controller.updateCategoryGet)
  .post("/editCategory", controller.updateCategoryPost)
  .get("/deleteAllData", controller.deleteAllDataPost); // remaining feature, implement later

module.exports = appRoute;
