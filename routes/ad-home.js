var express = require('express');
var bl = require('bl');
var chunk = require('chunk');
var request = require('request').defaults({baseUrl: 'http://localhost:5678/teasers/'});

var router = express.Router();
var example = {
  title: 'AD.nl',
  layout: "ad-layout",
  section: 'home',
  sixpacks: [
    {
      name: 'sixpack--1',
      teasers: [
        { bpClasses: "tile--1 tile-small-1x2 tile-medium-2x1 tile-large-2x1 tile-xlarge-2x1 tile-xxlarge-2x1" },
        { bpClasses: "tile--2 tile-small-1x1 tile-medium-1x1 tile-large-1x1 tile-xlarge-1x1 tile-xxlarge-1x1" }
      ]
    }
  ]
};

router.get('/', function(req, res, next) {
  request
    .get('AD_HOME-AD_SITE_PRIOS')
    .on('response', function(response) {
      response.pipe(bl(function(err, data) {
        if (err) {
          res.send('Error');
        }
        prios = JSON.parse(data);

        var sixpacks = [];
        var parts = chunk(prios, 6);
        var teasers;

        for (var i = 0; i < parts.length; i++) {
          teasers = [];
          for (var j = 0; j < parts[i].length; j++) {
            teaser = parts[i][j];
            teaser.bpClasses = "tile--" + j + " tile-small-1x1 tile-medium-1x1 tile-large-1x1 tile-xlarge-1x1 tile-xxlarge-1x1";
            teasers.push(teaser);
          }
          sixpacks.push({name: 'sixpack--' + i, teasers: teasers});
        }
        example.sixpacks = sixpacks;
        res.render('ad-home', example);
      }));
    });
});

/* GET home page. */
router.get('/old', function(req, res, next) {
  res.render('ad-home',
  { title: 'AD.nl', layout: "ad-layout", section: 'home',
    sixpacks: [
      { name: 'sixpack--1', teasers: [
        { bpClasses: "tile--1 tile-small-1x2 tile-medium-2x1 tile-large-2x1 tile-xlarge-2x1 tile-xxlarge-2x1" },
        { bpClasses: "tile--2 tile-small-1x1 tile-medium-1x1 tile-large-1x1 tile-xlarge-1x1 tile-xxlarge-1x1" }
      ] }
    ]
  });
});

module.exports = router;
