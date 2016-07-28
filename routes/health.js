var express = require('express');
var router = express.Router();

/* GET health status. */
router.get('/', function(req, res, next) {
  res.send({ status: 'UP' });
});

module.exports = router;
