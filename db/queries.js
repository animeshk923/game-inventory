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
  return await pool.query(
    `
    SELECT game_name AS games FROM games 
    ORDER BY game_name ASC;
    `
  );
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
    select * from categories where category_id = $1;
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

// WRITE Queries
async function insertGame(game, studio, categoryIds) {
  const studioResult = await pool.query(
    `INSERT INTO studio (studio_name) VALUES $1 RETURNING studio_id;`,
    [studio]
  );

  const studioId = studioResult.rows[0].studio_id;

  const gamesResult = await pool.query(
    `INSERT INTO games (game_name, studio_id) VALUES ($1, $2) RETURNING game_id`,
    [game, studioId]
  );

  const gameId = gamesResult.rows[0].game_id;

  for (const category of categoryIds) {
    await pool.query(
      `INSERT INTO game_categories (game_id, category_id) VALUES ($1, $2);`,
      [gameId, category]
    );
  }
}

async function insertNewCategory(categryName) {}

async function insertNewStudio(studioName) {}
// UPDATE Queries

// DELETE Queries
async function deleteAllData() {
  await pool.query("DROP TABLE games;");
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
  insertGame,
  insertNewCategory,
  insertNewStudio,
  deleteAllData,
};
