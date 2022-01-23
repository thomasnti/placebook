const { v4: uuidv4 } = require("uuid");
const {validationResult} = require('express-validator');

const HttpError = require("../models/http-error");

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

function getPlaceById(req, res, next) {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (place) {
    res.json({ place: place });
  } else {
    // res.status(404).send({message: 'There is no place with such id!!'})
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
}

function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => {
    // console.log(place.creator);
    return place.creator === userId;
  });

  if (places && places.length > 0) {
    res.send({ places });
  } else {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }
}

function createPlace(req, res, next) {
  expressValidatorError(req); // call express-validation validationResult to check for errors

  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title, // shortcut for title: title
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
}

function updatePlace(req, res, next) {
  expressValidatorError(req);

  const { title, description } = req.body; // we allow to update only title and description
  const placeId = req.params.pid;

  // const updatedPlace = DUMMY_PLACES.find(p => p.id === placeId) Not a good practice
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; // instead i create a copy of DUMMY_PLACES object
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
}

function deletePlace(req, res, next) {
  const placeId = req.params.pid;

  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
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
