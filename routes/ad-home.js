var express = require('express');
var bl = require('bl');
var chunk = require('chunk');
var dateformat = require('dateformat');
var i18n = require('i18n');
var path = require('path');
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

i18n.configure({
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'nl'
});
i18n.setLocale('nl');

router.get('/', function(req, res, next) {
  request
    .get('AD_HOME-AD_SITE_PRIOS')
    .on('response', function(response) {
      response.pipe(bl(function(err, data) {
        if (err) {
          res.send('Error');
        }
        var prios = JSON.parse(data);
        var midnight = new Date();
        midnight.setHours(0);
        midnight.setMinutes(0);
        midnight.setSeconds(0);
        midnight.setMilliseconds(0);

        var sixpacks = [];
        var parts = chunk(prios, 6);
        var teasers;

        for (var i = 0; i < parts.length; i++) {
          teasers = [];
          for (var j = 0; j < parts[i].length; j++) {
            teaser = parts[i][j];
            teaser.bpClasses = "tile--" + j + " tile-small-1x1 tile-medium-1x1 tile-large-1x1 tile-xlarge-1x1 tile-xxlarge-1x1";
            teaserDate = new Date(teaser.lastUpdate);
            if (teaserDate < midnight) {
              teaser.date = dateformat(teaserDate, "d ") + i18n.__(dateformat(teaserDate, "mmmm"));
            } else {
              teaser.date = dateformat(teaserDate, "H:MM");
            }
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
