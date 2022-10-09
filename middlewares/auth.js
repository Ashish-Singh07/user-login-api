var jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: async (req, res, next) => {// this middleware is applied to the routes which will implement authorization using jwt
    console.log(req.headers);
    var token = req.headers.authorization;
    try {
      if (!token) {
        return next(createError(400,'Token Required'));
      }
      var payload = await jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = payload; //all the routes after this will have access to the user which is logged in
      return next();
    } catch (error) {
      next(error);
    }
  }
};
