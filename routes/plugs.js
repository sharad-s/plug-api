const { Plug, validate } = require("../models/plug");
const { User } = require("../models/user");

// const {Snippet} = require('../models/snippet');

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// middleware
const optionalAuth = require("../middleware/optionalAuth");
const validateObjectId = require("../middleware/validateObjectId");
const validateSoundcloudURL = require("../middleware/validateSoundcloudURL");

// Soundcloud Utils
const { resolveURL } = require("../utils/soundcloud");
const isEmpty = require("../utils/isEmpty");

router.get("/", async (req, res) => {
  const plugs = await Plug.find().sort("dateCreated");
  res.send(plugs);
});

router.post("/", optionalAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Should create snippets array
  const snippets = [
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId()
  ];

  // should update dateCreated
  const dateCreated = Date.now();

  const plug = new Plug({
    title: req.body.title,
    soundcloudURL: req.body.soundcloudURL,
    imageURL: req.body.imageURL,
    creator: req.user._id,
    dateCreated,
    snippets
  });

  await plug.save();

  res.send(plug);
});

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Genre.findById(req.body.genreId);
//   if (!genre) return res.status(400).send("Invalid genre.");

//   const movie = await Movie.findByIdAndUpdate(
//     req.params.id,
//     {
//       title: req.body.title,
//       genre: {
//         _id: genre._id,
//         name: genre.name
//       },
//       numberInStock: req.body.numberInStock,
//       dailyRentalRate: req.body.dailyRentalRate
//     },
//     { new: true }
//   );

//   if (!movie)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(movie);
// });

// router.delete("/:id", async (req, res) => {
//   const movie = await Movie.findByIdAndRemove(req.params.id);

//   if (!movie)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(movie);
// });

// router.get("/:id", async (req, res) => {
//   const movie = await Movie.findById(req.params.id);

//   if (!movie)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(movie);
// });

router.get("/user/:id", validateObjectId, async (req, res) => {
  const userId = req.params.id;

  // Find Tracks with matching owner Id
  const plugs = await Plug.find({
    "creator": userId
  });
  // console.log(plugs, userId);

  // If tracks are empty, return 404
  if (isEmpty(plugs)) {
    return res
      .status(404)
      .json({ plugs: "No tracks were found for the given user." });
  }

  res.send(plugs);
});

module.exports = router;
