var schedule = require('node-schedule');
var express = require('express');
var compress = require('compression');
var Minilog = require("minilog");
Minilog.enable();
var log = Minilog("main");

var keys = ["biojs", "bionode"];

var stats = {};
var packages = require("./lib/packages.js");
stats.packages = new packages({
  keys: keys
});

var app = express();
var port = process.env.PORT || process.argv[2] || 3000;
app.use(compress());

// refresh every hour
new schedule.scheduleJob({
  seconds: 30
}, function() {
  console.log('You will see this message every second');
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
