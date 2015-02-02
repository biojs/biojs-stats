var npmK = require("npm-keywords");
var keys = ["biojs"];
var q = require("bluebird");
var _ = require("lodash");
var npmRegistry = require("npm-registry");
var npm = new npmRegistry();
var p = q.promisifyAll(npm.packages);
var Minilog = require("minilog");
var log = Minilog("packages");

module.exports = function() {

  var self = this;
  this.run = function() {

    logger.info("starting package task");

    // download all biojs packages
    var packages = npmK(keys).some(5).map(function(pkg) {
      return p.getAsync(pkg.name).then(function(p) {
        return p[0];
      });
    });

    // apply some statistics
    //
    // stat: package history
    var created = packages.then(function(pkgs) {
      return _.map(pkgs, _.partialRight(_.pick, "name", "created"));
    }).then(function(pkgs) {
      pkgs = _.sortBy(pkgs, "created");

      // count the packages
      _.each(pkgs, function(p, i) {
        p.count = i;
      });

      logger.info("finished package task with " + pkgs.length + " packages");

      self.result = pkgs;
    });
    return created;
  };

};
