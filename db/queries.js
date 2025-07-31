const pool = require("./pool");

async function queryByCategory(username, text) {
  await pool.query(
    `
    SELECT DISTINCT g.name
    FROM games AS g
    INNER JOIN game_categories AS gc ON g.game_id = gc.game_id
    INNER JOIN categories AS c ON gc.category_id = c.category_id
    WHERE c.name = 'Action';
`,
    [username, text]
  );
}

async function getAllStudioAndGame(id) {
  const { rows } = await pool.query(
    `
    SELECT  g.name, s.name FROM studio AS s
    INNER JOIN games AS g
    ON s.studio_id = g.studio_id;`,
    [id]
  );
  return rows;
}

async function getStudioAndGameByName(name) {
  const { rows } = await pool.query(
    `
    SELECT  g.name, s.name FROM studio AS s
    INNER JOIN games AS g
    ON s.studio_id = g.studio_id
    WHERE s.name ILIKE '($1)%';`,
    [id]
  );
  return rows;
}

async function deleteAllData() {
  await pool.query("DROP TABLE games;");
}
module.exports = {
  queryByCategory,
  getAllStudioAndGame,
  getStudioAndGameByName,
  deleteAllData,
};
