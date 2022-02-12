const { v4: uuidv4 } = require("uuid");

const {expressValidatorError} = require('./places-controllers');
const HttpError = require("../models/http-error");
const User = require('../models/User');


// ** Get all users
async function getUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, '-password');
    // users = await User.find({}, 'name email');
  } catch (err) {
    console.log(err);
    return next(new HttpError('Fetching users failed, please try again later.', 500));
  }

  res.json({users: users.map(user => user.toObject({ getters: true }))});
}

// ** Sign up a user (create)
async function signup(req, res, next) {
  expressValidatorError(req, next);

  const {name, email, password} = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({email: email});
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  if (existingUser){
    //throw new HttpError('Could not create user, email is already used', 422); //THROW DOES NOT WORK WELL WITH PROMISES AND CREATES BUGS
    return next(new HttpError('Could not create user, email is already used', 422));
  }

  const createdUser = new User({
    name,
    email,
    password,
    image: req.file.path,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  res.status(201).json({user: createdUser.toObject({getters: true})});
}

// ** Login a user
async function login(req, res, next) {
  const {email, password} = req.body;

  let loggedUser;
  try {
    loggedUser = await User.findOne({email: email});
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  if (!loggedUser || loggedUser.password !== password){
    return next(new HttpError('Could not verify user, check again the credentials', 401));
  }

  res.json({
    message: 'Loggen in!',
    user: loggedUser.toObject({ getters: true }),
  });
}


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;