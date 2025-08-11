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
  .post("/editCategory", controller.updateCategoryPost);

appRoute
  .get("/deleteGame", controller.deleteGameGet)
  .post("/deleteStudio", controller.deleteStudioPost)
  .get("/deleteCategory", controller.deleteCategoryGet)
  .post("/deleteGame", controller.deleteGamePost)
  .get("/deleteStudio", controller.deleteStudioGet)
  .post("/deleteCategory", controller.deleteCategoryPost);

module.exports = appRoute;
