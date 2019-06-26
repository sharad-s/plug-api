const Joi = require("joi");
const mongoose = require("mongoose");

const Snippet = mongoose.model(
  "Snippet",
  new mongoose.Schema({
    // Soundcloud ID to call API with. Also a unique ID
    soundcloudID: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255
    },
    artist: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255
    },
    // Soundcloud permalink URL for direct links
    soundcloudPermalinkURL: {
      type: String,
      required: true,
      trim: true
    },
    imageURL: {
      type: String,
      required: true
    },
    startTime: {
      type: Number,
      default: 45
    },
    endTime: {
      type: Number,
      default: 60
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    playCount: {
      type: Number,
      default: 0
    }
  })
);

function validateSnippet(snippet) {
  const schema = {
    soundcloudID: Joi.string().required(),
    title: Joi.string()
      .min(1)
      .max(255)
      .required(),
    artist: Joi.string()
      .min(1)
      .max(255)
      .required(),
    soundcloudPermalinkURL: Joi.string()
      .min(1)
      .max(255)
      .required(),
    imageURL: Joi.string()
      .min(1)
      .max(255)
      .required(),
    createdBy: Joi.objectId()
  };

  return Joi.validate(snippet, schema);
}

exports.Snippet = Snippet;
exports.validateSnippet = validateSnippet;
