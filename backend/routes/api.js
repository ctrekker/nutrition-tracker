const express = require('express');
const router = express.Router();
const shortid = require('shortid');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('state.db');

dbInit();

const initNutrients = ['Sodium, mg', 'Calories', 'Potassium, mg', 'Calcium, mg', 'Fiber, %', 'Sat. Fat, %', 'Protein, g', 'Carbs, g'];
const initValues = {
  'Veg. lasagna 1/2': [395, 145, 230, 125, 7, 9, 5, 20],
  'Tofu scramble 1/2': [395, 210, 420, 75, 9, 10, 10, 12],
  'Brown rice bowl, 1/2': [295, 145, 280, 30, 9, 4, 4, 20],
  'Enchilada, 1/2': [410, 180, 325, 60, 12, 3, 6, 28],
  'Veggie loaf, 1/2': [370, 175, 485, 40, 15, 3, 5, 27],
  'Classic bkfst burrito, 1/2': [345, 145, 180, 65, 5, 8, 5, 16],
  'Risotto, 1/2': [295, 115, 65, 40, 4, 23, 3, 17],
  'Turkey sausage': [440, 90, 122, 0, 0, 10, 11, 1],
  'Chicken & Sage sausage': [390, 110, 93, 9, 0, 10, 9, 1],
  
  'Granola C/R 1/3C & Raisins 1/4C': [45, 245, 390, 35, 12, 3, 3, 52],
  'Granola C/R 1/3C': [35, 125, 90, 15, 6, 3, 3, 22],
  'Raisins 1/4 C': [10, 120, 300, 20, 6, 0, 1, 31],
  'Apple sauce, Motts': [0, 50, 80, 0, 4, 0, 0, 13],
  'Apple sauce, Org. great value': [5, 60, 0, 0, 4, 0, 0, 15],
  'Orange juice, 8oz': [0, 110, 450, 20, 0, 0, 2, 26],
  
  'Cape Cod potato chips, low fat': [125, 130, 450, 0, 7, 0, 2, 18],
  'Blue chips, On the Border': [115, 150, 66, 27, 4, 5, 2, 16],
  'Larabar, AP': [10, 200, 300, 50, 15, 4, 4, 25],
  'Builders bar 1/2': [100, 145, 106, 23, 4, 15, 10, 15],
  'Cheese stick, CJ, Sargento, low fat': [120, 70, 10, 150, 0, 15, 6, 0],
};

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

router.get('/init', (req, res) => {
  db.serialize(() => {
    // Insert foods
    const foodStmt = db.prepare('INSERT OR IGNORE INTO foods (user_id, name) VALUES(?, ?)');
    for(let foodName of Object.keys(initValues)) {
      foodStmt.run(req.query.userId, foodName);
    }
    foodStmt.finalize();
    
    // Insert nutrients
    const nutrientStmt = db.prepare('INSERT OR IGNORE INTO nutrients (user_id, name) VALUES(?, ?)');
    for(let nutrientName of initNutrients) {
      nutrientStmt.run(req.query.userId, nutrientName);
    }
    nutrientStmt.finalize();
    
    // Insert nutrient values
    db.all('SELECT food_id, name FROM foods WHERE user_id = $userId', { $userId: req.query.userId }, (err, foodEntries) => {
      if(err) throw err;
      db.all('SELECT nutrient_id, name FROM nutrients WHERE user_id = $userId', { $userId: req.query.userId }, (err2, nutrientEntries) => {
        if(err2) throw err2;
        const stmt = db.prepare('INSERT OR IGNORE INTO nutrient_values (user_id, food_id, nutrient_id, value) VALUES (?, ?, ?, ?)');
        for(let [foodName, nutrientValues] of Object.entries(initValues)) {
          const foodId = foodEntries.find(x => x.name === foodName).food_id;
          for(let nutrientName of initNutrients) {
            const nutrientId = nutrientEntries.find(x => x.name === nutrientName).nutrient_id;
            stmt.run(req.query.userId, foodId, nutrientId, nutrientValues[initNutrients.indexOf(nutrientName)]);
          }
        }
      });
    });
    
    res.send('');
  });
});

router.get('/foods', (req, res) => {
  db.all('SELECT food_id, name FROM foods WHERE user_id = $userId ORDER BY food_id', {
    $userId: req.query.userId
  }, (err, rows) => {
    if(err) throw err;
    res.json(rows);
  })
});
router.post('/foods', (req, res) => {
  db.run('INSERT OR IGNORE INTO foods (user_id, name) VALUES ($userId, $name)', {
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
  db.all('SELECT nutrient_id, name FROM nutrients WHERE user_id = $userId ORDER BY nutrient_id', {
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
  db.run('INSERT OR IGNORE INTO nutrient_values (user_id, food_id, nutrient_id, value) VALUES ($userId, $foodId, $nutrientId, $value)', {
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
  db.all('SELECT food_entry_id, food_id, entry_date FROM food_entries WHERE user_id = $userId', {
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
      token TEXT NOT NULL,
      UNIQUE (token)
    )
    `);
    
    db.run(`
    CREATE TABLE IF NOT EXISTS foods (
      food_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      name TEXT NOT NULL,
      UNIQUE (user_id, name),
      FOREIGN KEY (user_id)
        REFERENCES users (user_id)
    )
    `);
    
    db.run(`
    CREATE TABLE IF NOT EXISTS nutrients (
      nutrient_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      name TEXT NOT NULL,
      UNIQUE (user_id, name),
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
      UNIQUE (user_id, food_id, nutrient_id)
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
      food_entry_id INTEGER PRIMARY KEY,
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
