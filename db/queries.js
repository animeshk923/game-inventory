const pool = require("./pool");

// READ Queries
async function queryAllData() {
  return await pool.query(
    `
    SELECT 
      g.game_name AS game,
      s.studio_name AS studio,
      STRING_AGG(c.category_name, ', ') AS categories
    FROM 
      games AS g
      INNER JOIN studio AS s ON s.studio_id = g.studio_id
      INNER JOIN game_categories AS gc ON g.game_id = gc.game_id
      INNER JOIN categories AS c ON gc.category_id = c.category_id
    GROUP BY 
      g.game_name,
      s.studio_name
    ORDER BY
      g.game_name ASC;
    `
  );
}

async function queryOnlyGames() {
  const { rows } = await pool.query(
    `
    SELECT * FROM games 
    ORDER BY game_name ASC;
    `
  );

  return rows;
}

async function queryOnlyStudios() {
  const { rows } = await pool.query(
    `
    SELECT * FROM studio 
    ORDER BY studio_name ASC;
    `
  );
  return rows;
}

async function queryOnlyCategories() {
  const { rows } = await pool.query(
    `
    SELECT * FROM categories 
    ORDER BY category_name ASC;
    `
  );
  return rows;
}

async function queryGamesByCategory(categoryId) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM games AS g
    INNER JOIN game_categories AS gc ON g.game_id = gc.game_id
    INNER JOIN categories AS c ON gc.category_id = c.category_id
    WHERE c.category_id = $1;
`,
    [categoryId]
  );

  return rows;
}

async function queryCategoryById(categoryId) {
  const { rows } = await pool.query(
    `
    SELECT * FROM categories WHERE category_id = $1;
  `,
    [categoryId]
  );

  return rows;
}

async function queryGamesByStudio(studioId) {
  const { rows } = await pool.query(
    `
    SELECT g.game_name AS games, s.studio_name AS studios
    FROM games AS g
    INNER JOIN studio AS s ON g.studio_id = s.studio_id
    WHERE s.studio_id = $1;
`,
    [studioId]
  );

  return rows;
}

async function queryAllGamesAndStudio() {
  const { rows } = await pool.query(
    `
    SELECT  g.game_name AS games, s.studio_name AS studio FROM studio AS s
    INNER JOIN games AS g
    ON s.studio_id = g.studio_id
    ORDER BY g.game_name ASC;`
  );
  return rows;
}

async function queryGameIdByName(gameName) {
  const { rows } = await pool.query(
    `
    SELECT * FROM games WHERE game_name ILIKE $1%`,
    [gameName]
  );
  return rows[0].studio_id;
}

async function queryStudioIdByName(studioName) {
  const { rows } = await pool.query(
    `
    SELECT * FROM studio WHERE studio_name = $1`,
    [studioName]
  );
  return rows;
}

async function queryCategoryIdByName(categoryName) {
  const { rows } = await pool.query(
    `
    SELECT * FROM categories WHERE category_name = $1`,
    [categoryName]
  );
  return rows;
}

// WRITE Queries
async function insertGame(gameName, categoryIdsList, studioId) {
  const gameIdResult = await pool.query(
    `INSERT INTO games (game_name, studio_id) VALUES ($1, $2) RETURNING game_id`,
    [gameName, studioId]
  );

  const gameId = gameIdResult.rows[0].game_id;

  for (const categoryId of categoryIdsList) {
    await pool.query(
      `INSERT INTO game_categories (game_id, category_id) VALUES ($1, $2);`,
      [gameId, categoryId]
    );
  }
}

async function insertNewCategory(categoryName) {
  await pool.query(`INSERT INTO categories (category_name) VALUES ($1);`, [
    categoryName,
  ]);
}

async function insertNewStudio(studioName) {
  await pool.query(`INSERT INTO studio (studio_name) VALUES ($1);`, [
    studioName,
  ]);
}

// UPDATE Queries
async function updateGame(newGameName, gameId) {
  await pool.query(
    `
    UPDATE games SET game_name = $1 WHERE game_id = $2;
  `,
    [newGameName, gameId]
  );
}

async function updateStudio(newStudioName, studioId) {
  await pool.query(
    `
    UPDATE studio SET studio_name = $1 WHERE studio_id = $2;
  `,
    [newStudioName, studioId]
  );
}

async function updateCategory(newCategoryName, categoryId) {
  await pool.query(
    `
    UPDATE categories SET category_name = $1 WHERE category_id = $2;
  `,
    [newCategoryName, categoryId]
  );
}

// DELETE Queries
async function deleteGame(gameId) {
  await pool.query(`DELETE FROM games WHERE game_id = $1`, [gameId]);
}

async function deleteStudio(studioId) {
  await pool.query(`DELETE FROM studio WHERE studio_id = $1`, [studioId]);
}

async function deleteCategory(categoryId) {
  await pool.query(`DELETE FROM categories WHERE category_id = $1`, [
    categoryId,
  ]);
}

module.exports = {
  queryAllData,
  queryOnlyGames,
  queryOnlyStudios,
  queryOnlyCategories,
  queryGamesByCategory,
  queryGamesByStudio,
  queryAllGamesAndStudio,
  queryCategoryById,
  queryGameIdByName,
  queryStudioIdByName,
  queryCategoryIdByName,
  insertGame,
  insertNewCategory,
  insertNewStudio,
  updateGame,
  updateStudio,
  updateCategory,
  deleteGame,
  deleteStudio,
  deleteCategory,
};
