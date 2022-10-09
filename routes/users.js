var express = require("express");
var router = express.Router();
var auth = require("./../middlewares/auth");
var createError = require("http-errors");

var Users = require("./../models/users");

/* GET all users listing */
router.get("/", async(req, res, next) => {
  try {
    var users = Users.find({});
    users ? res.json({users}) : next(createError(404, "No user found"));
  } catch (error) {
    next(error);
  }  
});

/* GET user by ID */
router.get("/:id", async(req, res, next) => {
  var id = req.params.id;
  try {
    var user = await Users.findById(id);
    user ? res.json({user}) : next(createError(404, "No user found by this id"));
  } catch (error) {
    next(error);
  }
});

/* Registation handler */
router.post("/register" , async(req, res, next) => {
  try {
    var user = await Users.create(req.body);
    // generate JWT token after successful registration
    var token = await user.signToken();
    res.header("Authorization", token).json({user: user.userJSON(token)});
  } catch (error) {
    next(error);
  }
});

/* Login handler */
router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return next(createError(400,'Email/Password not provided'));
  }
  try {
    var user = await Users.findOne({ email });
    if (!user) {
      return next(createError(400,`${email} is not yet registered. Please Register first`));
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      //if result is false means that the password entered by the user does not match with the password which was used to register the user
      return next(createError(403,'Incorrect password'));
    }
    // generate JWT token after loggin is successful
    var token = await user.signToken();
    return res.header("Authorization", token).json({user: user.userJSON(token)});
  } catch (error) {
    next(error);
  }
});

//implementing authorization for all the routes which come after this point without indivisually plugging in the authorization middleware
router.use(auth.verifyToken);

//implementing authorization on a protected route
router.get("/auth/favourite", auth.verifyToken , (req, res) => {  //explicitly adding the auth.verifyToken middleware
  console.log(req.user);
  if (req.user && req.user.userId) {
    //if the request has a valid jwt token, auth.verifyToken middleware is able to verify the user and add user object to the request which contains userId and email
    res.send("Protected Resource is accesible since user is logged in");
  } else {
    next(createError(401,'Protected Resource is not accesible since user is not logged in'));
  }
});

//Logout Route
router.get("/logout", (req, res, next) => {
  //To be implemented
  return res.json({ 'msg': "Not implemented yet" });
});

/* Update users by id using PUT */
router.put("/:id", async(req, res, next) => {
  var id = req.params.id;
  try {
    var user = await Users.findByIdAndUpdate(id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }  
});

/* Update users by id using patch */
router.patch("/:id", async(req, res, next) => {
  var id = req.params.id;
  try {
    var user = await Users.findByIdAndUpdate(id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/* Delete users by id */
router.delete("/:id", async(req, res, next) => {
  var id = req.params.id;
  try {
    var user = await Users.findByIdAndDelete(id);
    res.send(`User ${deletedUser.name} was deleted from the record`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
