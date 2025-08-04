const db = require("../db/queries");

async function indexPageGet(req, res) {
  const studioList = await db.queryOnlyStudios();
  const categoryList = await db.queryOnlyCategories();
  console.log(categoryList);
  console.log(studioList);
  
  res.render("index", { studioList: studioList, categoryList: categoryList });
}

async function getGamesByStudioId(req, res) {
  const { studioId } = req.params;
  const games = await db.queryGamesByStudio(studioId);
  console.log(games);

  res.render("gamesByStudios", { games: games });
}

async function getGamesByCategoryId(req, res) {
  const { categoryId } = req.params;
  const games = await db.queryGamesByCategory(categoryId);
  // console.log(games);

  res.render("gamesByCategory", { games: games });
}

module.exports = {
  indexPageGet,
  getGamesByStudioId,
  getGamesByCategoryId
};
