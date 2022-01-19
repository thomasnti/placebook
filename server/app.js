const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use(placesRoutes); // we pass placesRoutes as middleware to our app

app.listen(5000, () => {
  console.log("Placebook's server is listening on port 5000");
});
