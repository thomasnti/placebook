const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/places', placesRoutes); // api/places = path (route) for which the middleware function applies.

app.listen(5000, () => {
  console.log("Placebook's server is listening on port 5000");
});
