const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    snippets: {
      type: [Schema.Types.ObjectId],
      ref: "Snippet"
    }
  })
);

function validatePlug(plug) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required()
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
