'use-strict';

const MONGOOSE = require('mongoose');
const bcryptjs = require('bcryptjs');


//  Create a schema for the user
const UserSchema = new MONGOOSE.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
});
UserSchema.authenticate = function(username, password, callback) {
  User.findOne({username: username})
      .exec(function(err, user) {
        if (err) {
          return callback(err);
        } else if (!user) {
          const err = new Error('User Not Found');
          err.status = 401;
          return callback(err);
        }
        bcryptjs.compare(password, user.password, (err, result)=>{
          if (true == result) {
            return callback(null, user);
          } else {
            return callback();
          }
        });
      });
};

//  Hash the password before saving it to the database
UserSchema.pre('save', function(next) {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(this.password, salt);
  this.password = hash;
  next();
});

//  Create User model
const User = MONGOOSE.model('User', UserSchema);

//  Export the User model
module.exports = User;
