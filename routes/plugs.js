const { Plug, validate } = require("../models/plug");
const { User } = require("../models/user");

// const {Snippet} = require('../models/snippet');

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// middleware
const optionalAuth = require("../middleware/optionalAuth");

router.get("/", async (req, res) => {
  const plugs = await Plug.find().sort("dateCreated");
  res.send(plugs);
});

router.post("/", optionalAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("REQ.USER", req.user._id, req.user.id);

  // const genre = await Genre.findById(req.body.genreId);
  // if (!genre) return res.status(400).send('Invalid genre.');

  
  
  
  
  
  
  const plug = new Plug({
    title: req.body.title,
    soundcloudURL: req.body.soundcloudURL,
    creator: req.user._id
  });




  await plug.save();

  res.send(plug);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
