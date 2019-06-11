const Joi = require("joi");
const mongoose = require("mongoose");
// const { genreSchema } = require("./genre");

const Plug = mongoose.model(
  "Plugs",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255
    },
    soundcloudURL: {
      type: String,
      required: true,
      trim: true
    },
    imageURL: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    snippets: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Snippet"
    },
    playCount: {
      type: Number,
      default: 0
    },
    shortID: {
      type: String,
      default: ""
    },
    dateCreated: {
      type: Date
    },
    dateUpdated: {
      type: Date
    }
  })
);

function validatePlug(plug) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    soundcloudURL: Joi.string()
      .min(5)
      .max(50)
      .required(),
    imageURL: Joi.string().required(),
    snippets: Joi.array().required()
    // creator: Joi.objectId().required(),
  };

  return Joi.validate(plug, schema);
}

exports.Plug = Plug;
exports.validate = validatePlug;
