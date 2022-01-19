const express = require('express');

const router = express.Router(); //! router with capital R

router.get('/', (req, res, next) => {
  console.log('GET request for places');
  res.json({ message: 'It works!' });
});

module.exports = router;
