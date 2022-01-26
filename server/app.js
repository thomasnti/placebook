require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes); // api/places = path (route) for which the middleware function applies.
app.use("/api/users", usersRoutes);

// if the endpoint is not in the above routes
app.use(() => {
  throw new HttpError("Could not find this route!", 404);
});

//* Error handling middleware , callback runs when server 'throws' (with throw keyword) an error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured !!" });
});

// connect returns a promise
mongoose
  .connect(`mongodb+srv://${process.env.DB_USER +':'+ process.env.DB_PASS}@cluster0.tb3hp.mongodb.net/places?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(5000, () => {
      console.log("Placebook's server is listening on port 5000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
