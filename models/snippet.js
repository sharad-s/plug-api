const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Plug = mongoose.model(
  "Snippet",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255
    },
    soundcloudID: {
      type: String,
      required: true,
      trim: true
    },
    soundcloudURL: {
      type: String,
      required: true,
      trim: true
    },
    snippets: {
      type: [Schema.Types.ObjectId],
      ref: "Snippet"
    },
    playCount: {
      type: Number,
      default: 0
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
    createdBy: Joi.objectId().required()
  };

  return Joi.validate(plug, schema);
}

exports.Plug = Plug;
exports.validate = validatePlug;
