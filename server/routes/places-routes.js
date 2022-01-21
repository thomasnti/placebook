const express = require('express');

const router = express.Router(); //! router with capital R

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'National garder of Athens',
    description: 'One of the most famous gardens in Greece !!!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: 'Syntagma',
    creator: 'u1'
  }
];

//* Get a place by it's unique id
router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId)

  if (place) {
    res.send({place: place})
  } else {
    res.send({message: 'There is no place with such id!!'})
  }
});

//* Get places by user id
router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter(place => {
    console.log(place.creator);
    return place.creator === userId
  })

  res.send({places})
})

module.exports = router;
