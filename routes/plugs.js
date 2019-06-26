const { Plug, validate } = require("../models/plug");
const { User } = require("../models/user");
const { Snippet, validateSnippet } = require("../models/snippet");

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
  const plugs = await Plug.find()
    .sort({ dateCreated: -1 })
    .populate("creator");
  // .populate("snippets");
  res.send(plugs);
});

// @route   POST /api/plugs/
// @desc    Creates a New Plug. Ties it to a creator if user is authenticated. Creator is empty if not.
// @access  Public & Private
router.post("/", optionalAuth, async (req, res) => {
  // Validate Input
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if Plug already Exists - if true, return err
  let foundPlug = await Plug.findOne({ shortID: req.body.shortID });
  if (foundPlug) return res.status(400).send("Plug already exists.");

  // Create Snippet objects for DB/Plug
  let snippetIDs;
  try {
    // Returns array of Mongo IDs for each Snippet in the Plug
    snippetIDs = await Promise.all(
      req.body.snippets.map(async snippet => {
        // Check if Snippet already exists - if false, create it in DB
        let foundSnippet = await Snippet.findOne({
          soundcloudID: snippet.soundcloudID
        });
        if (isEmpty(foundSnippet)) {
          foundSnippet = await new Snippet({
            ...snippet,
            creator: req.user._id
          }).save();
        }

        // Return snippet Mongo ID
        return mongoose.Types.ObjectId(foundSnippet._id);
      })
    );
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  // Create Plug Object for DB
  const plug = new Plug({
    title: req.body.title,
    soundcloudURL: req.body.soundcloudURL,
    imageURL: req.body.imageURL,
    shortID: req.body.shortID,
    kind: req.body.kind,
    creator: req.user._id,
    dateCreated: Date.now(),
    snippets: snippetIDs
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
  })
    .populate("creator")
    .populate("snippets");

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

  let plugs = await findRandom(amount);

  // Populate plug from DB 
  plugs = await Promise.all(
    plugs.map(async plug => {
      return await Plug.findById(plug._id)
        .populate("creator")
        .populate("snippets");
    })
  );

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
  const plug = await Plug.findOne({
    shortID
  })
    .populate("creator")
    .populate("snippets");

  // await plug.populate()

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
  const plug = await Plug.findById(objectID)
    .populate("creator")
    .populate("snippets");

  // If tracks are empty, return 404
  if (isEmpty(plug)) {
    return res
      .status(404)
      .json({ plugs: "No plugs were found for the given ObjectID." });
  }

  res.send(plug);
});

module.exports = router;
