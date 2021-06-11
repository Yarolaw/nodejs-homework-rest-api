const multer = require('multer');
require('dotenv').config();
const UPLOUD_DIR = process.env.UPLOUD_DIR;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOUD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
  limits: {
    fileSize: 2000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }
    const error = new Error('Wrong format for avatars');
    error.status = 400;
    cb(error);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
