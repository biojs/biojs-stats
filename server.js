var CronJob = require('cron').CronJob;
var express = require('express');
var compress = require('compression');
var Minilog = require("minilog");
Minilog.enable();
var log = Minilog("main");

var stats = {};
stats.packages = require("./lib/packages.js");

var app = express();
var port = process.env.PORT || process.argv[2] || 3000;
app.use(compress());

// refresh every hour
new CronJob('10 10 * * * *', function(){
    console.log('You will see this message every second');
}, null, true);

app.get("/packages/simple", function(req, res){
  var result = stats.packages.result;
  if(!result){
    res.status(500).send("Server is about to start");
  }
  res.jsonp(result);
});

var server = app.listen(port, function() {
  log.info('Listening on port ' + server.address().port);
});
