require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");

const SQL = `
-- Studio table
CREATE TABLE IF NOT EXISTS studio (
    studio_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    studio_name VARCHAR(255) NOT NULL UNIQUE
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR(255) NOT NULL UNIQUE
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    game_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_name VARCHAR(255) NOT NULL,
    studio_id INT NOT NULL,
    FOREIGN KEY (studio_id) REFERENCES studio(studio_id) ON DELETE CASCADE
);

-- Junction table (game-category)
CREATE TABLE IF NOT EXISTS game_categories (
    game_id INT,
    category_id INT,
    PRIMARY KEY (game_id, category_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

INSERT INTO studio (studio_name) VALUES
  ('Nintendo'),
  ('Santa Monica Studio'),
  ('Mojang Studios'),
  ('ConcernedApe'),
  ('Team Cherry'),
  ('Matt Makes Games'),
  ('Valve'),
  ('CD Projekt Red'),
  ('Rockstar Games'),
  ('FromSoftware'),
  ('Rockstar North'),
  ('Naughty Dog'),
  ('Supergiant Games'),
  ('InnerSloth'),
  ('Obsidian Entertainment'),
  ('Blizzard Entertainment'),
  ('Riot Games'),
  ('Larian Studios'),
  ('Motion Twin'),
  ('Re-Logic'),
  ('Atlus'),
  ('BioWare');

INSERT INTO categories (category_name) VALUES
  ('Adventure'),
  ('Open World'),
  ('Action'),
  ('Sandbox'),
  ('Survival'),
  ('Simulation'),
  ('RPG'),
  ('Metroidvania'),
  ('Platformer'),
  ('Indie'),
  ('Puzzle'),
  ('Co-op'),
  ('Roguelike'),
  ('Party'),
  ('Social Deduction'),
  ('Souls-like'),
  ('FPS'),
  ('Team-based'),
  ('MOBA'),
  ('Strategy'),
  ('Tactical Shooter'),
  ('Turn-based'),
  ('Life'),
  ('VR'),
  ('Futuristic'),
  ('Shooter'),
  ('Sci-fi'),
  ('Japanese'),
  ('Social Sim');

INSERT INTO games (game_name, studio_id) VALUES
('The Legend of Zelda: Breath of the Wild', 1),  -- Nintendo
('God of War', 2),                              -- Santa Monica Studio
('Minecraft', 3),                               -- Mojang Studios
('Stardew Valley', 4),                          -- ConcernedApe
('Hollow Knight', 5),                           -- Team Cherry
('Celeste', 6),                                 -- Matt Makes Games
('Portal 2', 7),                                -- Valve
('The Witcher 3: Wild Hunt', 8),                -- CD Projekt Red
('Red Dead Redemption 2', 9),                   -- Rockstar Games
('Elden Ring', 10),                             -- FromSoftware
('Grand Theft Auto V', 11),                     -- Rockstar North
('The Last of Us Part II', 12),                 -- Naughty Dog
('Super Mario Odyssey', 1),                     -- Nintendo
('Hades', 13),                                  -- Supergiant Games
('Among Us', 14),                               -- InnerSloth
('Fallout: New Vegas', 15),                     -- Obsidian Entertainment
('Dark Souls III', 10),                         -- FromSoftware
('Overwatch 2', 16),                            -- Blizzard Entertainment
('League of Legends', 17),                      -- Riot Games
('Counter-Strike 2', 7),                        -- Valve
('Baldur''s Gate 3', 18),                       -- Larian Studios
('Animal Crossing: New Horizons', 1),           -- Nintendo
('Half-Life: Alyx', 7),                         -- Valve
('Cyberpunk 2077', 8),                          -- CD Projekt Red
('Mass Effect Legendary Edition', 22),          -- BioWare
('Dead Cells', 19),                             -- Motion Twin
('Terraria', 20),                               -- Re-Logic
('Persona 5 Royal', 21);                        -- Atlus

INSERT INTO game_categories (game_id, category_id) VALUES
-- The Legend of Zelda: Breath of the Wild
(1, 1), (1, 2), (1, 3), (1, 7), (1, 24),

-- God of War
(2, 1), (2, 3), (2, 7), (2, 16),

-- Minecraft
(3, 2), (3, 4), (3, 5), (3, 10), (3, 6),

-- Stardew Valley
(4, 6), (4, 10), (4, 23), (4, 28),

-- Hollow Knight
(5, 1), (5, 8), (5, 10), (5, 3),

-- Celeste
(6, 9), (6, 10), (6, 3),

-- Portal 2
(7, 11), (7, 3), (7, 1), (7, 24),

-- The Witcher 3: Wild Hunt
(8, 1), (8, 2), (8, 7), (8, 26),

-- Red Dead Redemption 2
(9, 1), (9, 2), (9, 3), (9, 7),

-- Elden Ring
(10, 1), (10, 2), (10, 3), (10, 7), (10, 16),

-- Grand Theft Auto V
(11, 1), (11, 2), (11, 3), (11, 14),

-- The Last of Us Part II
(12, 1), (12, 3), (12, 7),

-- Super Mario Odyssey
(13, 1), (13, 9), (13, 3),

-- Hades
(14, 3), (14, 7), (14, 10), (14, 13),

-- Among Us
(15, 14), (15, 15), (15, 10),

-- Fallout: New Vegas
(16, 1), (16, 7), (16, 20), (16, 22),

-- Dark Souls III
(17, 1), (17, 3), (17, 7), (17, 16),

-- Overwatch 2
(18, 3), (18, 17), (18, 25), (18, 24),

-- League of Legends
(19, 3), (19, 18), (19, 26), (19, 7),

-- Counter-Strike 2
(20, 3), (20, 17), (20, 21),

-- Baldur's Gate 3
(21, 7), (21, 22), (21, 1),

-- Animal Crossing: New Horizons
(22, 6), (22, 23), (22, 14),

-- Half-Life: Alyx
(23, 1), (23, 3), (23, 24),

-- Cyberpunk 2077
(24, 7), (24, 25), (24, 26),

-- Mass Effect Legendary Edition
(25, 7), (25, 22), (25, 26),

-- Dead Cells
(26, 13), (26, 8), (26, 3),

-- Terraria
(27, 4), (27, 5), (27, 10), (27, 3),

-- Persona 5 Royal
(28, 7), (28, 28), (28, 29), (28, 27);
`;

async function main() {
  console.log("seeding...");

  // PROD DB
  const client = new Client({
    // connectionString: process.argv[2], // pass your connection URI as a argument when running this script
    connectionString: `postgresql://${process.env.AIVEN_DB_USERNAME}:${process.env.AIVEN_DB_PASSWORD}@${process.env.AIVEN_DB_HOSTNAME}:${process.env.AIVEN_DB_PORT}/${process.env.AIVEN_DB}`,

    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync("./ca.pem").toString(),
    },
  });

  // LOCAL DB
  // const client = new Client({
  //   // connectionString: process.argv[2], // pass your connection URI as a argument when running this script
  //   connectionString: `postgresql://${process.env.LOCAL_DB_USERNAME}:${process.env.LOCAL_DB_PASSWORD}@${process.env.LOCAL_DB_HOSTNAME}:${process.env.LOCAL_DB_PORT}/${process.env.LOCAL_DB}`,
  // });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
