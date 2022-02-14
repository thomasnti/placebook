require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
//! Deployment in a single server
app.use(express.static(path.join('public')));


//! This fixes CORS error on the browser
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use("/api/places", placesRoutes); // api/places = path (route) for which the middleware function applies.
app.use("/api/users", usersRoutes);

//! Deployment in a single server
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// if the endpoint is not in the above routes
app.use(() => {
  throw new HttpError("Could not find this route!", 404);
});

//* Error handling middleware , callback runs when server 'throws' (with throw keyword) an error
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    }); // if the file is saved and we have an error DELETE the file !
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured !!" });
});

// connect returns a promise
mongoose
  .connect(`mongodb+srv://${process.env.DB_USER +':'+ process.env.DB_PASS}@cluster0.tb3hp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Placebook's server is listening on port 5000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
