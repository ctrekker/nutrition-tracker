const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('state.db');

dbInit();

router.get('/', (req, res) => {
  res.send('API v1.0 root');
});

router.post('/users', (req, res) => {

});

function dbInit() {
  db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY,
      token TEXT NOT NULL
    )
    `);
    
    db.run(`
    CREATE TABLE IF NOT EXISTS foods (
      food_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY (user_id)
        REFERENCES users (user_id)
    )
    `);
    
    db.run(`
    CREATE TABLE IF NOT EXISTS nutrients (
      nutrient_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY (user_id)
        REFERENCES users (user_id)
    )
    `);
    
    db.run(`
    CREATE TABLE IF NOT EXISTS nutrient_values (
      nutrient_value_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      food_id INTEGER,
      nutrient_id INTEGER,
      value REAL,
      FOREIGN KEY (user_id)
        REFERENCES users (user_id)
      FOREIGN KEY (food_id)
        REFERENCES foods (food_id)
      FOREIGN KEY (nutrient_id)
        REFERENCES nutrients (nutrient_id)
    )
    `);
    
    db.run(`
    CREATE TABLE IF NOT EXISTS food_entries (
      nutrient_entry_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      food_id INTEGER,
      FOREIGN KEY (user_id)
        REFERENCES users (user_id)
      FOREIGN KEY (food_id)
        REFERENCES foods (food_id)
    )
    `);
  });
}

module.exports = router;
