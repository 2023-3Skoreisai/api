const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// GETリクエストのSQLクエリ
router.get('/get', (req, res) => {
  const db = new sqlite3.Database('db/data.sqlite3');
  const query = req.query;
  let sql = 'SELECT * FROM user_data WHERE 1=1'; // 1=1 を追加して必ず真となる条件を設定

  if (Object.keys(query).length > 0) {
    if (query.id) {
      sql += ' AND id = ?';
    } else if (query.name) {
      sql += ' AND name = ?';
    } else if (query.result) {
      sql += ' AND result = ?';
    } else {
      res.status(400).json({ error: 'Invalid query parameters' });
      return;
    }
  }

  db.all(sql, [query.id || query.name || query.result], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!rows.length) {
      res.status(404).json({ error: 'No matching data found' });
    } else {
      res.status(200).json(rows);
    }
  });

  db.close();
});

router.post('/post', (req, res) => {
  const db = new sqlite3.Database('db/data.sqlite3');
  const name = req.query.name;
  const pass = req.query.pass;
  const score = req.query.score;
  const result = req.query.result;

  if (!name || !pass || !score || !result) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  db.get('SELECT MAX(id) AS max_id FROM user_data', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const id = row.max_id ? row.max_id + 1 : 1;
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

      const sql = 'INSERT INTO user_data(id, name, pass, score, result, date) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [id, name, pass, score, result, date];

      db.run(sql, values, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).json({ message: 'Data added successfully' });
        }
      });
    }
  });

  db.close();
});

// DELETEリクエストのSQLクエリ
router.delete('/del', (req, res) => {
  const db = new sqlite3.Database('db/data.sqlite3');
  const id = req.query.id;
  const name = req.query.name;

  if (!id || !name) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  const sql = 'DELETE FROM user_data WHERE id = ? AND name = ?';
  const values = [id, name];

  db.run(sql, values, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'No matching data found' });
      return;
    }

    res.status(200).json({ message: 'Data deleted successfully' });
  });

  db.close();
});

module.exports = router;