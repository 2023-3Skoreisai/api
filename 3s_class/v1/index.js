const express = require('express');
const router = express.Router();

router.use('/user', require("./user.js"));
router.use('/analytics', require("./analytics.js")); 

router.get('/', (req, res) => {
  res.status(200).json({
    message: "3S API v1 successfly started."
  });
});

module.exports = router;