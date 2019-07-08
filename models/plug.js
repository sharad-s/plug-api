const Joi = require("joi");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var random = require("mongoose-simple-random");
// const { genreSchema } = require("./genre");

// Snippet Model
const { Snippet } = require("./snippet");

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
  soundcloudID: {
    type: String,
    // required: true,
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

// Virtual Properties
plugSchema.virtual("totalPlays").get(async function() {
  // const reducer = (accumulator, currentValue) => accumulator + currentValue;

  // // Get Play Counts of each snippet in Plug into an array
  // const playCounts = await Promise.all(
  //   this.snippets.map(async snippetId => {
  //     return (await Snippet.findById(snippetId)).playCount;
  //   })
  // );

  // // reduce the array to find its sum
  // const totalPlays = playCounts.reduce(reducer, 0);
  // return totalPlays;
 return  Math.floor(Math.random() * 100);
});

// Plugins
plugSchema.plugin(random);
plugSchema.plugin(mongoosePaginate);

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
