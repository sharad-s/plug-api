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
      minlength: 1,
      maxlength: 255
    },
    soundcloudURL: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255
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
    },
    kind: {
      type: String,
      required: true,
      enum: ["user", "playlist", "track"]
    }
  })
);

function validatePlug(plug) {
  const schema = {
    title: Joi.string()
      .min(1)
      .max(255)
      .required(),
    soundcloudURL: Joi.string()
      .min(1)
      .max(255)
      .required(),
    imageURL: Joi.string().required(),
    snippets: Joi.array(),
    shortID: Joi.string(),
    kind: Joi.string()
      .valid(["user", "playlist", "track"])
      .required()

    // creator: Joi.objectId().required(),
  };

  return Joi.validate(plug, schema);
}

exports.Plug = Plug;
exports.validate = validatePlug;
