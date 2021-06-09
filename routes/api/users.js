const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  logout,
  getCurrentUser,
  authorize,
  authValidation,
} = require('../../model/usersControllers');

router.post('/signup', authValidation, signUp);
router.post('/login', authValidation, signIn);
router.post('/logout', authorize, logout);
router.post('/current', authorize, getCurrentUser);

module.exports = router;
