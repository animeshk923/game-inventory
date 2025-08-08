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
  const { gameName, studioName } = req.body;
  const selectedCategory = req.body.category || [];

  const categoryIdsArray = await Promise.all(
    selectedCategory.map(async (categoryName) => {
      return await getCategoryId(categoryName);
    })
  );

  const studioIdResult = await db.queryStudioIdByName(studioName);
  const studioId = studioIdResult[0].studio_id;
  await db.insertGame(gameName, categoryIdsArray, studioId);

  res.redirect("/");
}

async function getCategoryId(categoryName) {
  const rows = await db.queryCategoryIdByName(categoryName);
  return rows[0].category_id;
}

async function addStudioGet(req, res) {
  res.render("addNewStudio");
}

async function addStudioPost(req, res) {
  const studioName = req.body.studioName;
  await db.insertNewStudio(studioName);

  console.log(studioName, "inserted in DB");

  res.redirect("/");
}

async function addCategoryGet(req, res) {
  res.render("addNewCategory");
}

async function addCategoryPost(req, res) {
  const categoryName = req.body.categoryName;
  await db.insertNewCategory(categoryName);

  console.log(categoryName, "inserted in DB");

  res.redirect("/");
}

async function deleteAllDataPost() {
  await db.deleteAllData();
  res.render("deleteDataMessage");
}
module.exports = {
  indexPageGet,
  getGamesByStudioId,
  getGamesByCategoryId,
  addGamesGet,
  addGamesPost,
  addStudioGet,
  addStudioPost,
  addCategoryGet,
  addCategoryPost,
  deleteAllDataPost,
};
