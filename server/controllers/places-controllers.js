const { v4: uuidv4 } = require("uuid");
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const HttpError = require("../models/http-error");
const getCoordsForAdrress = require('../util/location');
const Place = require('../models/Place');
const User = require('../models/User');


// ** Get a place by it's id
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
    return next(new HttpError("Could not find a place for the provided id.", 404)); //* "throw" ends the function similarly to "return"
  }
}

// ** Get all places a user has
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

// ** Create a new place
async function createPlace(req, res, next) {
  expressValidatorError(req, next); // call express-validation validationResult to check for errors

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
    // image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/447px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
    image: req.file.path,
    address,
    location: coordinates,
    creator
  })

  let user;
  try {
    // await createdPlace.save();
    user = await User.findById(creator) // find by creator id
  } catch (err) {
    console.log(err);
    return next(new HttpError('Creating place failed, please try again', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session: sess});
    user.places.push(createdPlace);
    await user.save({session: sess}); // skaei epeidh xrhsimopoiw to mongoose-unique-validator
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  res.status(201).json({ place: createdPlace });
}

// ** Update a place by it's id
async function updatePlace(req, res, next) {
  expressValidatorError(req, next);

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

// ** Delete a place by it's id
async function deletePlace(req, res, next) {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    console.log(err);
    return next(new HttpError(
      'Something went wrong, could not delete place.',
      500
    ));
  }

  if (!place) {
    return next(new HttpError('Could not find place for this id.', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    place.creator.places.pull(place); //* it is possible because of populate
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError(
      'Something went wrong, could not delete place.',
      500
    ));
  }

  const imagePath = place.image;
  fs.unlink(imagePath, (err) => console.log(err));

  res.status(200).json({message: `Place with id: ${placeId} and title: ${place.title} deleted!`})
}

const expressValidatorError = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data!', 422));
  }
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.expressValidatorError = expressValidatorError;
