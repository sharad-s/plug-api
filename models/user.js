const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
require('dotenv').config() 


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  soundcloudURL: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  imageURL: {
    type: String,
    minlength: 5,
    maxlength: 255
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      soundcloudURL: this.soundcloudURL,
      imageURL: this.imageURL
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

// Pre-save hook
userSchema.pre("save", function(next) {
  const regex = /large/gi;

  // Upscale image URL
  if (this.imageURL) {
    this.imageURL = this.imageURL.replace(regex, "t500x500");
  }
  next();
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(1)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    soundcloudURL: Joi.string()
      .min(5)
      .max(255)
      .required(),
    imageURL: Joi.string()
      .min(5)
      .max(255)
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
