const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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

function getPlaceByUserId(req, res, next) {
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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
