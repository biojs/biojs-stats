var schedule = require('node-schedule');
var express = require('express');
var compress = require('compression');
var Minilog = require("minilog");
var packages = require("./lib/packages");
var wares = require("./lib/middlewares");

// config
var port = process.env.PORT || process.argv[2] || 3000;
var keys = ["biojs", "bionode"];

// set up logging
Minilog.enable();
var log = Minilog("main");

var stats = {};
var packages = require("./lib/packages.js");
stats.packages = new packages({
  keys: keys
});

var app = express();
app.use(compress());
wares.activate(app);

// refresh every half an hour
new schedule.scheduleJob({
  minute: 30
}, function() {
  runner();
});

app.get("/packages/simple", function(req, res) {
  var result = stats.packages.result;
  if (!result) {
    res.status(500).send("Server is about to start");
  }
  res.jsonp(result);
});

app.get('/', function mainpage(req, res) {
  res.sendFile("./README.md", {
    root: __dirname
  });
});

// init
function runner() {
  stats.packages.run();
}
runner();

var server = app.listen(port, function() {
  log.info('Listening on port ' + server.address().port);
});
