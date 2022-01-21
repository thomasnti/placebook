const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/places', placesRoutes); // api/places = path (route) for which the middleware function applies.


//* Error handling middleware , callback runs when server 'throws' (with throw keyword) an error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }

  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occured !!'})
})

app.listen(5000, () => {
  console.log("Placebook's server is listening on port 5000");
});
