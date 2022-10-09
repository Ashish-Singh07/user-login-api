var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
  },
  { timestamps: true }
);

//presave hook. triggered before saving anything in db
userSchema.pre('save', async function(next) {
  // this condition will make sure that only if the password is supplied and it has been modified then only encrypt it
  // it will prevent useless encrypting of password when we are updating any other field of user. It will encrypt again only when it is changed
  if(this.password && this.isModified('password')) {
      try {
          this.password = await bcrypt.hash(this.password, 10);   //set the password for currently referenced user to the hashed password
      } catch (error) {
          return next(error); //so that if password need not be encrypted, then directly move to next level of execution
      }        
  }
  next()
})

// Defining a method on the userSchema for comparing the encrypted passwords. By defining it here, this function will be accessible everywhere where userSchema is used.
userSchema.methods.verifyPassword = async function(password) {
  try {
    //password is the password which we receive
      var result = await bcrypt.compare(password , this.password) ;
      return result;  //the result is a boolean value : either true or false based on whether the passwords matched or not
  } catch (error) {
      return error;
  }
}

userSchema.methods.signToken = async function () {
  var payload = { userId: this.id, email: this.email };
  try {
    var token = await jwt.sign(payload, process.env.TOKEN_SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token
  };
};

module.exports = mongoose.model("User", userSchema);
