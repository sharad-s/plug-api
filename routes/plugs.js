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

// @route   GET /api/plugs/test
// @desc    TEST
// @access  Public
router.get("/test", async (req, res) => {
  console.log("Random");
  res.send("TEST");
});

// @route   GET /api/plugs/
// @desc    Gets all plugs created
// @access  Public
router.get("/", async (req, res) => {
  const plugs = await Plug.find().sort("dateCreated").populate("creator");
  res.send(plugs);
});

// @route   POST /api/plugs/
// @desc    Creates a New Plug. Ties it to a creator if user is authenticated. Creator is empty if not.
// @access  Public & Private
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
    shortID: req.body.shortID,
    kind: req.body.kind,
    creator: req.user._id,
    dateCreated,
    snippets
  });

  await plug.save();

  res.send(plug);
});

// @route   GET /api/plugs/user/:id
// @desc    Gets all plugs created by user with id :id
// @access  Public
router.get("/user/:id", validateObjectId, async (req, res) => {
  const userId = req.params.id;

  // Find Tracks with matching owner Id
  const plugs = await Plug.find({
    creator: userId
  });

  // If tracks are empty, return 404
  if (isEmpty(plugs)) {
    return res
      .status(404)
      .json({ plugs: "No tracks were found for the given user." });
  }

  res.send(plugs);
});


// @route   GET /api/plugs/random
// @desc    Get random plugs, with number being ?amount
// @access  Public
router.get("/random", async (req, res) => {
  console.log("Random");
  let amount = req.query.amount;

  // Find Random Tracks Promise wrapper
  // TODO: Move logic to Plug model.
  const findRandom = (limit = 1) =>
    new Promise((resolve, reject) => {
      Plug.findRandom({}, {}, { limit }, function(err, result) {
        return err ? reject(err) : resolve(result);
      });
    });

  const plugs = await findRandom(amount);

  // If tracks are empty, return 404
  if (isEmpty(plugs)) {
    return res.status(404).json({ plugs: "Could not return random plugs." });
  }

  res.send(plugs);
});


// @route   GET /api/plugs/:shortID
// @desc    Get a plug with a specific shortID
// @access  Public
router.get("/shortID/:shortID", async (req, res) => {
  const shortID = req.params.shortID;

  // Find Tracks with matching owner Id
  const plug = await Plug.find({
    shortID
  });

  // If tracks are empty, return 404
  if (isEmpty(plug)) {
    return res
      .status(404)
      .json({ plugs: "No plugs were found for the given shortID." });
  }

  res.send(plug);
});

// @route   GET /api/plugs/:id
// @desc    Get a plug with a specific objectID
// @access  Public
router.get("/:id", validateObjectId, async (req, res) => {
  const objectID = req.params.id;

  // Find Tracks with matching owner Id
  const plug = await Plug.findById(objectID);

  // If tracks are empty, return 404
  if (isEmpty(plug)) {
    return res
      .status(404)
      .json({ plugs: "No plugs were found for the given ObjectID." });
  }

  res.send(plug);
});

module.exports = router;
