const { Snippet, validateSnippet } = require("../models/snippet");

const express = require("express");
const router = express.Router();

// middleware
const validateObjectId = require("../middleware/validateObjectId");

const isEmpty = require("../utils/isEmpty");

// @route   POST /api/snippets/incrementPlayCount/:id
// @desc    Increment Play Count of Snippet with ObjectID :id
// @access  Public
router.post("/incrementPlayCount/:id", validateObjectId, async (req, res) => {
  const snippetId = req.params.id;

  // Find Tracks with matching owner Id
  const snippet = await Snippet.findByIdAndUpdate(snippetId, { $inc: { playCount: 1 }});

  // If tracks are empty, return 404
  if (isEmpty(snippet)) {
    return res
      .status(404)
      .json({ snippets: "No Snippet was able to be found or updated." });
  }

  res.send(snippet);
});


module.exports = router;
