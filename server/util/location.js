const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyB989-m0aOuszyT0l9BmSlNXjE9_mLUumM';

async function getCoordsForAdrress(address) {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`);

  if (!response.data || response.data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for the specified address !', 404);
  }

  const coordinates = response.data.results[0].geometry.location;
  return coordinates;
}


module.exports = getCoordsForAdrress;