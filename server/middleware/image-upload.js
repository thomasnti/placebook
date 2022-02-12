const multer = require('multer');
const { v1: uuidv1 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/images');
  },
  filename: (req, file, callback) => {
    const suffix = MIME_TYPE_MAP[file.mimetype];
    callback(null, uuidv1() + '.' + suffix);
  }
});

const fileFilter = (req, file, callback) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype]; //* double ! to convert null or undefined to false
  let error = isValid ? null : new Error('Invalid mime type!');

  callback(error, isValid);
}

const imageUpload = multer({
  limits: 1000000, // kb
  storage: storage,
  fileFilter: fileFilter
});

module.exports = imageUpload;