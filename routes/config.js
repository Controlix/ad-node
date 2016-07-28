var express = require('express');
var request = require('request').defaults({baseUrl: 'http://localhost:5678/config/'});

var router = express.Router();

/* GET config. */
router.get('/app/:app/profile/:profile', function(req, res, next) {
  req.pipe(request.get(req.params.app + '/' + req.params.profile)).pipe(res);
});

module.exports = router;
