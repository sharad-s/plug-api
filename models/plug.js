const Joi = require("joi");
const mongoose = require("mongoose");
var random = require("mongoose-simple-random");
// const { genreSchema } = require("./genre");

const plugSchema = new mongoose.Schema({
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
  snippets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet"
    }
  ],
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
});

// Plugins
plugSchema.plugin(random);

// Pre-save hook
plugSchema.pre("save", function(next) {
  const regex = /large/gi;

  // Change image URL
  if (this.imageURL) {
    this.imageURL = this.imageURL.replace(regex, "t500x500");
  }
  next();
});

// Model
const Plug = mongoose.model("Plugs", plugSchema);

// Validator
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
    snippets: Joi.array()
      .items(Joi.object(snippetJoiSchema))
      .required(),
    shortID: Joi.string(),
    kind: Joi.string()
      .valid(["user", "playlist", "track"])
      .required()

    // creator: Joi.objectId().required(),
  };

  return Joi.validate(plug, schema);
}

const snippetJoiSchema = {
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
    .required()
  // createdBy: Joi.objectId()
};

exports.Plug = Plug;
exports.validate = validatePlug;
