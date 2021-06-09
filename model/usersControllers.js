const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const User = require('../schemas/users');
const SECRET_KEY = process.env.SECRET_KEY;

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).send('Invalid id');
  }

  next();
};

const authValidation = (req, res, next) => {
  const validationRules = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    if (!authorizationHeader) {
      return res.status(401).json('Not authorized');
    }

    const token = authorizationHeader.replace('Bearer ', '');

    const userId = await jwt.verify(token, SECRET_KEY).id;
    if (!userId) {
      return res.status(401).json('Not authorized');
    }

    const user = await User.findById(userId);
    if (!user || user.token !== token) {
      return res.status(401).json('Not authorized');
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

const signUp = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(400)
      .json({ status: 'error', code: 200, message: 'Email in used' });
  }
  try {
    const createUser = async (body) => {
      const user = new User(body);
      return await user.save();
    };
    const data = await createUser({
      ...req.body,
    });

    return res.status(201).json({
      status: 'success',
      code: 201,
      user: { data },
    });
  } catch (e) {
    next(e);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Email or password is wrong',
      });
    }
    const id = user.id;
    const payload = { id, users: 'Users' };

    const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { token },
      { new: true }
    );
    return res.status(200).json({
      user: {
        updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      token: null,
    });

    return res.status(204).send('No content');
  } catch (err) {
    next(err);
  }
};
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const currentUser = await User.findById(userId);

    return res.status(200).json(currentUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signUp,
  signIn,
  logout,
  getCurrentUser,
  validateId,
  authorize,
  authValidation,
};
