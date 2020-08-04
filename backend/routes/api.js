const express = require('express');
const router = express.Router();
const shortid = require('shortid');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('state.db');

dbInit();

router.get('/', (req, res) => {
  res.send('API v1.0 root');
});

router.post('/users', (req, res) => {
  const userToken = shortid.generate();
  db.run('INSERT INTO users (token) VALUES ($token)', {
    $token: userToken
  });
  res.send(userToken);
});

router.get('/foods', (req, res) => {
  db.all('SELECT food_id, name FROM foods WHERE user_id = $userId', {
    $userId: req.query.userId
  }, (err, rows) => {
    if(err) throw err;
    res.json(rows);
  })
});
router.post('/foods', (req, res) => {
  db.run('INSERT INTO foods (user_id, name) VALUES ($userId, $name)', {
    $userId: req.query.userId,
    $name: req.body.name
  });
  res.send('');
});
router.delete('/foods/:foodId', (req, res) => {
  db.run('DELETE FROM foods WHERE food_id = $foodId AND user_id = $userId', {
    $userId: req.query.userId,
    $foodId: req.params.foodId
  });
  res.send('');
});

router.get('/nutrients', (req, res) => {
  db.all('SELECT nutrient_id, name FROM nutrients WHERE user_id = $userId', {
    $userId: req.query.userId
  }, (err, rows) => {
    if(err) throw err;
    res.json(rows);
  })
});
router.post('/nutrients', (req, res) => {
  db.run('INSERT INTO nutrients (user_id, name) VALUES ($userId, $name)', {
    $userId: req.query.userId,
    $name: req.body.name
  });
  res.send('');
});
router.delete('/nutrients/:nutrientId', (req, res) => {
  db.run('DELETE FROM nutrients WHERE nutrient_id = $nutrientId AND user_id = $userId', {
    $userId: req.query.userId,
    $nutrientId: req.params.nutrientId
  });
  res.send('');
});

router.get('/foods/nutrients', (req, res) => {
  db.all('SELECT nutrient_value_id, food_id, nutrient_id, value FROM nutrient_values WHERE user_id = $userId', {
    $userId: req.query.userId
  }, (err, food_nutrients) => {
    if(err) throw err;
    res.json(food_nutrients);
  });
});
router.post('/foods/nutrients', (req, res) => {
  db.run('INSERT INTO nutrient_values (user_id, food_id, nutrient_id, value) VALUES ($userId, $foodId, $nutrientId, $value)', {
    $userId: req.query.userId,
    $foodId: req.body.foodId,
    $nutrientId: req.body.nutrientId,
    $value: req.body.value
  });
  res.send('');
});
router.delete('/foods/nutrients/:nutrientValueId', (req, res) => {
  db.run('DELETE FROM nutrient_values WHERE user_id = $userId AND nutrient_value_id = $nutrientValueId', {
    $userId: req.query.userId,
    $nutrientValueId: req.params.nutrientValueId
  });
  res.send('');
});

router.get('/foods/entries', (req, res) => {
  db.all('SELECT food_id, entry_date FROM food_entries WHERE user_id = $userId', {
    $userId: req.query.userId
  }, (err, foodEntries) => {
    if(err) throw err;
    res.json(foodEntries);
  });
});
router.post('/foods/entries', (req, res) => {
  db.run('INSERT INTO food_entries (user_id, food_id) VALUES ($userId, $foodId)', {
    $userId: req.query.userId,
    $foodId: req.body.foodId
  });
  res.send('');
});
router.delete('/foods/entries/:foodEntryId', (req, res) => {
  db.run('DELETE FROM food_entries WHERE user_id = $userId AND food_entry_id = $foodEntryId', {
    $userId: req.query.userId,
    $foodEntryId: req.params.foodEntryId
  });
  res.send('');
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
      entry_date DATE DEFAULT (datetime('now')),
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
