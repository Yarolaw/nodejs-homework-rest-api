const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  logout,
  getCurrentUser,
  authorize,
  authValidation,
  updateAvatars,
  verify,
  repeatEmailVerification,
} = require('../../model/usersControllers');

const upload = require('../../helpers/upload.js');

router.post('/signup', authValidation, signUp);
router.post('/login', authValidation, signIn);
router.post('/logout', authorize, logout);
router.post('/current', authorize, getCurrentUser);
router.patch('/avatars', authorize, upload.single('avatar'), updateAvatars);

router.get('/verify/:verificationToken', verify);
router.post('/verify', repeatEmailVerification);

module.exports = router;
