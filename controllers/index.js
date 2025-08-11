require("dotenv").config();
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

async function updateGameGet(req, res) {
  const gameList = await db.queryOnlyGames();
  res.render("updateGame", { gameList: gameList });
}

async function updateGamePost(req, res) {
  const { gameName, gameId, adminPass } = req.body;
  if (adminPass === process.env.ADMIN_PASS) {
    await db.updateGame(gameName, gameId);
    res.redirect("/");
  } else {
    res.render("wrongPasswordPage");
  }
}

async function updateStudioGet(req, res) {
  const studioList = await db.queryOnlyStudios();
  res.render("updateStudio", { studioList: studioList });
}

async function updateStudioPost(req, res) {
  const { studioName, studioId, adminPass } = req.body;
  if (adminPass === process.env.ADMIN_PASS) {
    await db.updateStudio(studioName, studioId);
    res.redirect("/");
  } else {
    res.render("wrongPasswordPage");
  }
}

async function updateCategoryGet(req, res) {
  const categoryList = await db.queryOnlyCategories();
  res.render("updateCategory", { categoryList: categoryList });
}

async function updateCategoryPost(req, res) {
  const { categoryName, categoryId, adminPass } = req.body;
  if (adminPass === process.env.ADMIN_PASS) {
    await db.updateCategory(categoryName, categoryId);
    res.redirect("/");
  } else {
    res.render("wrongPasswordPage");
  }
}

async function deleteGameGet(req, res) {
  const gameList = await db.queryOnlyGames();
  res.render("deleteGame", { gameList: gameList });
}

async function deleteGamePost(req, res) {
  const { gameId, adminPass } = req.body;
  if (adminPass === process.env.ADMIN_PASS) {
    await db.deleteGame(gameId);
    res.redirect("/");
  } else {
    res.render("wrongPasswordPage");
  }
}

async function deleteStudioGet(req, res) {
  const studioList = await db.queryOnlyStudios();
  res.render("deleteStudio", { studioList: studioList });
}

async function deleteStudioPost(req, res) {
  const { studioId, adminPass } = req.body;
  if (adminPass === process.env.ADMIN_PASS) {
    await db.deleteStudio(studioId);
    res.redirect("/");
  } else {
    res.render("wrongPasswordPage");
  }
}

async function deleteCategoryGet(req, res) {
  const categoryList = await db.queryOnlyCategories();
  res.render("deleteCategory", { categoryList: categoryList });
}

async function deleteCategoryPost(req, res) {
  const { categoryId, adminPass } = req.body;
  if (adminPass === process.env.ADMIN_PASS) {
    await db.deleteCategory(categoryId);
    res.redirect("/");
  } else {
    res.render("wrongPasswordPage");
  }
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
  updateGameGet,
  updateGamePost,
  updateStudioGet,
  updateStudioPost,
  updateCategoryGet,
  updateCategoryPost,
  deleteGameGet,
  deleteGamePost,
  deleteStudioGet,
  deleteStudioPost,
  deleteCategoryGet,
  deleteCategoryPost,
};
