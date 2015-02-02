var wares = {};

wares.cors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

wares.poweredBy = function (req, res, next) {
  res.setHeader("X-Powered-By", "BioJS");
  next();
};

wares.cacheControl = function (req, res, next) {
  res.setHeader("Cache-Control", "public,max-age=3600"); // 60m (in s)
  res.setHeader("Expires", new Date(Date.now() + 3600 * 1000).toUTCString()); // 1h (in ms)
  next();
};

wares.activate = function(app){
  app.use(wares.cors);
  app.use(wares.poweredBy);
  app.use(wares.cacheControl);
};

module.exports = wares;
