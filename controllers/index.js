const db = require("../db/queries");

async function indexPageGet(req, res) {
  const studioList = await db.queryOnlyStudios();
  res.render("index", { studioList: studioList });
}

async function getGamesByStudioId(req, res) {
  const { studioId } = req.params;
  const games = await db.queryGamesByStudio(studioId);
  console.log(games);

  res.render("gamesByStudios", { games: games });
}

module.exports = {
  indexPageGet,
  getGamesByStudioId,
};
