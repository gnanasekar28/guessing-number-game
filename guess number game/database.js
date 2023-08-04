const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
const db = new sqlite3.Database('scores.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      attempts INTEGER,
      timeTaken REAL
    )
  `);
});

app.use(express.json());

app.post('/save-score', (req, res) => {
  const { name, attempts, timeTaken } = req.body;

  db.run(
    'INSERT INTO scores (name, attempts, timeTaken) VALUES (?, ?, ?)',
    [name, attempts, timeTaken],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.sendStatus(500);
      }

      return res.sendStatus(200);
    }
  );
});

app.get('/best-score', (req, res) => {
  db.get(
    'SELECT * FROM scores ORDER BY attempts ASC, timeTaken ASC LIMIT 1',
    (err, row) => {
      if (err) {
        console.error(err.message);
        return res.sendStatus(500);
      }

      return res.json(row);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
