const { v4: uuidv4 } = require("uuid");
const {validationResult} = require('express-validator');

const HttpError = require("../models/http-error");
const getCoordsForAdrress = require('../util/location');
const Place = require('../models/Place');

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
  {
    id: "p2",
    title: "National garder of Athens",
    description: "One of the most famous gardens in Greece !!!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "Syntagma",
    creator: "u1",
  },
];

// **
async function getPlaceById(req, res, next) {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong, could not find this place.', 500));
  }

  if (place) {
    //Document.prototype.toObject() Mongoose method
    res.json({ place: place.toObject({getters: true}) }); // returns also id without _
  } else {
    throw new HttpError("Could not find a place for the provided id.", 404); //* "throw" ends the function similarly to "return"
  }
}

// **
async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({creator: userId})
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Fetching places failed, please try again later", 500)
    );
  }

  if (places && places.length > 0) {
    res.json({ places: places.map(place => place.toObject({getters: true})) });
  } else {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }
}

// **
async function createPlace(req, res, next) {
  expressValidatorError(req); // call express-validation validationResult to check for errors

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAdrress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title, // shortcut for title: title
    description,
    image: 'link for the image',
    address,
    location: coordinates,
    creator
  })

  try {
    await createdPlace.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Creating place failed, please try again', 500));
  }

  res.status(201).json({ place: createdPlace });
}

// **
async function updatePlace(req, res, next) {
  expressValidatorError(req);

  const { title, description } = req.body; // we allow to update only title and description
  const placeId = req.params.pid;

  /* first way
  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(new HttpError('Updating place failed, please try again', 500));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Updating place failed, please try again', 500));
  }
*/
  // second way
  let updatedPlace;
  try {
    updatedPlace = await Place.findByIdAndUpdate({_id: placeId}, {title: title, description: description});
  } catch (err) {
    console.log(err);
    return next(new HttpError('Updating place failed, please try again', 500));
  }

  res.status(200).json({ place: updatedPlace.toObject({getters: true}) });
}

// **
async function deletePlace(req, res, next) {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(new HttpError(
      'Something went wrong, could not delete place.',
      500
    ));
  }

  try {
    await place.remove();
  } catch (err) {
    console.log(err);
    return next(new HttpError(
      'Something went wrong, could not delete place.',
      500
    ));
  }

  res.status(200).json({message: `Place with id: ${placeId} deleted!`})
}

const expressValidatorError = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data!', 422);
  }
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.expressValidatorError = expressValidatorError;
