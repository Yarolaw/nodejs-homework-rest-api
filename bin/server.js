const app = require('./../app');
const db = require('./../db/index');
require('dotenv').config();
const createFolderIsNotExist = require('../helpers/create.folder');

const PORT = process.env.PORT || 3000;
const UPLOUD_DIR = process.env.UPLOUD_DIR;
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOUD_DIR);
    await createFolderIsNotExist(AVATAR_OF_USERS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((error) => {
  console.log(`Server not running. Error: ${error.message}`);
});
