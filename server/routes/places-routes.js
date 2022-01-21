const express = require("express");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router(); //! router with capital R

//* Get a place by it's unique id
router.get("/:pid", placesControllers.getPlaceById);

//* Get places by user id
router.get("/user/:uid", placesControllers.getPlaceByUserId);

module.exports = router;
