const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const auth = require("../../middleware/auth");

const Collections = require("../../models/Collections.js");
const User = require("../../models/User.js");

// Create a new collection
router.post(
  "/",
  [
    auth,
    [
      body("collectionName", "Please include the collection name")
        .not()
        .isEmpty(),
      body("isPrivate", "Would you like this collection to be private?")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select("-password");

    const { collectionName, collectionItems, isPrivate } = req.body;

    try {
      let newCollection = new Collections({
        userId: user.id,
        isPrivate,
        collectionName,
        collectionItems,
      });

      await newCollection.save();

      return res.json(newCollection);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get all collections that are not the user's or that is set private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const collections = await Collections.find();

    const filteredCollections = await collections.filter((e) => {
      return !e.isPrivate && e.userId !== user.id;
    });

    res.json(filteredCollections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new recipe to an already existing collection
router.put("/:id", auth, async (req, res) => {
  try {
    const targetedCollection = await Collections.findById(req.params.id);

    const { recipe } = req.body;
    const recipeId = uuidv4()
    
    recipe.id = recipeId

    if (targetedCollection.userId === req.user.id) {
        
      targetedCollection.collectionItems.push(recipe);
      await targetedCollection.save();

      res.json(targetedCollection)
    } else {
      return res
        .status(400)
        .json({
          errors: [
            { msg: "You do not have permission to edit this collection." },
          ],
        });
    }
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a recipe from a collection if authorized
router.delete("/:collectionId/:itemId", auth, async (req, res) => {
    try {
        const targetedCollection = await Collections.findById(req.params.collectionId);

        if(targetedCollection.userId === req.user.id) {
            const filteredCollection = targetedCollection.collectionItems.filter((e) => {
                return e.id !== req.params.itemId
            })

            targetedCollection.collectionItems = filteredCollection

            await targetedCollection.save();
            res.json(targetedCollection);
        } else {
            return res
              .status(400)
              .json({
                errors: [
                  { msg: "You do not have permission to edit this collection." },
                ],
              });
          }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
