const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.get('/get', (req, res) => {
  const db = new sqlite3.Database('db/data.sqlite3');
  const sql = 'SELECT date, COUNT(CASE WHEN result = ? THEN 1 END) AS success, COUNT(CASE WHEN result = ? THEN 1 END) AS fail, COUNT(*) AS total, MAX(score) AS max_point, MIN(score) AS low_point, AVG(score) AS ave FROM user_data GROUP BY date';
  const params = ['true', 'false'];

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const result = {
        byDate: rows,
        total: {
          success: 0,
          fail: 0,
          total: 0,
          max_point: 0,
          low_point: Infinity,
          ave: 0
        }
      };

      rows.forEach((row) => {
        result.total.success += row.success;
        result.total.fail += row.fail;
        result.total.total += row.total;
        result.total.max_point = Math.max(result.total.max_point, row.max_point);
        result.total.low_point = Math.min(result.total.low_point, row.low_point);
        result.total.ave += row.ave;
      });

      result.total.ave /= rows.length;
      result.total.low_point = Math.min(...rows.map(row => row.low_point));

      res.status(200).json(result);
    }
  });

  db.close();
});

module.exports = router;