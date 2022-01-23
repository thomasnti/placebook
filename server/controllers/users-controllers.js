const { v4: uuidv4 } = require("uuid");

const {expressValidatorError} = require('./places-controllers');
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Swartz',
    email: 'max@gmail.com',
    password: 'testers'
  }
]

function getUsers(req, res, next) {
  res.status(200).json({users: DUMMY_USERS});
}

function signup(req, res, next) {
  expressValidatorError(req);

  const {name, email, password} = req.body;

  const existedUser = DUMMY_USERS.find((user => user.email === email));

  if (existedUser){
    throw new HttpError('Could not create user, email is already used', 422)
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({user: createdUser});
}

function login(req, res, next) {
  const {email, password} = req.body;

  const loggedUser = DUMMY_USERS.find(user => user.email === email); // I find the user first, then check if the password is correct
  if (!loggedUser || loggedUser.password !== password){
    throw new HttpError('Could not verify user, check again the credentials', 401);
  }

  res.json({message: 'Loggen in!'})
}


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;