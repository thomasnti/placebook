const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");
const imageUpload = require('../middleware/image-upload');

const router = express.Router(); //! router with capital R

//* Get a place by it's unique id
router.get("/:pid", placesControllers.getPlaceById);

//* Get places by user id
router.get("/user/:uid", placesControllers.getPlacesByUserId);

//* Create a place
router.post(
  "/",
  imageUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
); // I can use more than one middlewares in a path , they execute from left to right (top to bottom with this function format)

//* Update a place
router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

//* Delete a place
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
