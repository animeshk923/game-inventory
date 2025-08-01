const pool = require("./pool");

// READ Queries
async function queryAllData() {
  return await pool.query(
    `
    SELECT 
      g.name AS game,
      s.name AS studio,
      STRING_AGG(c.name, ', ') AS categories
    FROM 
      games AS g
      INNER JOIN studio AS s ON s.studio_id = g.studio_id
      INNER JOIN game_categories AS gc ON g.game_id = gc.game_id
      INNER JOIN categories AS c ON gc.category_id = c.category_id
    GROUP BY 
      g.name,
      s.name
    ORDER BY
      g.name ASC;
    `
  );
}

async function queryOnlyGames() {
  return await pool.query(
    `
    SELECT name AS games FROM games 
    ORDER BY name ASC;
    `
  );
}

async function queryOnlyStudios() {
  return await pool.query(
    `
    SELECT name AS studios FROM studio 
    ORDER BY name ASC;
    `
  );
}

async function queryOnlyCategories() {
  return await pool.query(
    `
    SELECT name AS categories FROM categories 
    ORDER BY name ASC;
    `
  );
}

async function queryGamesByCategory(category) {
  const { rows } = await pool.query(
    `
    SELECT g.name AS games
    FROM games AS g
    INNER JOIN game_categories AS gc ON g.game_id = gc.game_id
    INNER JOIN categories AS c ON gc.category_id = c.category_id
    WHERE c.name ILIKE '($1)';
`,
    [category]
  );

  return rows;
}

async function queryGamesByStudio(studioName) {
  const { rows } = await pool.query(
    `
    SELECT g.name AS games, s.name AS studios
    FROM games AS g
    INNER JOIN studio AS s ON g.studio_id = s.studio_id
    WHERE s.name ILIKE '($1)';
`,
    [studioName]
  );

  return rows;
}

async function queryAllGamesAndStudio() {
  const { rows } = await pool.query(
    `
    SELECT  g.name AS games, s.name AS studio FROM studio AS s
    INNER JOIN games AS g
    ON s.studio_id = g.studio_id
    ORDER BY g.name ASC;`
  );
  return rows;
}

// WRITE Queries

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
  deleteAllData,
};
