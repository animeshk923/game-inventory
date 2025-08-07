const db = require("../db/queries");

async function indexPageGet(req, res) {
  const studioList = await db.queryOnlyStudios();
  const categoryList = await db.queryOnlyCategories();
  // console.log(categoryList);

  res.render("index", { studioList: studioList, categoryList: categoryList });
}

async function getGamesByStudioId(req, res) {
  const { studioId } = req.params;
  const games = await db.queryGamesByStudio(studioId);

  res.render("gamesByStudios", { games: games });
}

async function getGamesByCategoryId(req, res) {
  const { categoryId } = req.params;
  const studioName = await db.queryCategoryById(categoryId);
  const games = await db.queryGamesByCategory(categoryId);
  // console.log(games);

  res.render("gamesByCategory", { games: games, studioName: studioName });
}

async function addGamesGet(req, res) {
  const studioList = await db.queryOnlyStudios();
  const categoryList = await db.queryOnlyCategories();
  res.render("addNewGame", {
    studioList: studioList,
    categoryList: categoryList,
  });
}

async function addGamesPost(req, res) {
  // const { studio, category } = req.body;
  const { gameName, studioName } = req.body;
  const selectedCategory = req.body.category || [];
  // const studioId = await db.queryStudioIdByName(studioName);
  // await db.insertGame(gameName, studioId, categoryId);
  res.redirect("/");

  console.log(selectedCategory);
}

module.exports = {
  indexPageGet,
  getGamesByStudioId,
  getGamesByCategoryId,
  addGamesGet,
  addGamesPost,
};
