var jwt = require("jsonwebtoken");
var createError = require("http-errors");

module.exports = {
  verifyToken: async (req, res, next) => {// this middleware is applied to the routes which will implement authorization using jwt
    console.log(req.headers);
    var auth = req.headers.authorization.split(' ');
    var token = auth[1] || auth[0];

    try {
      if (!token) {
        return next(createError(403,'Token Required'));
      }
      var payload = await jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = payload; //all the routes after this will have access to the user which is logged in
      return next();
    } catch (error) {
      next(error);
    }
  }
};
