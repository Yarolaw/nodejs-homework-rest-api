const mongoose = require('mongoose');

require('dotenv').config();
const dbUri = process.env.MONGODB_URL;

const db = mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', _ => {
  console.log('Database connection successful');
});

mongoose.connection.on('error', err => {
  console.log(`Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', _ => {
  console.log('The connection with mongoose disconnected');
});

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log('DB was disconnected');
    process.exit(1);
  });
});

module.exports = db;
