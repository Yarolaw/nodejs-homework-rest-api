const Joi = require('joi');
const contactModel = require('../schemas/contacts');
const { isValidObjectId } = require('mongoose');

const listContacts = async (req, res) => {
  const data = await contactModel.find();
  res.status(200).json(data);
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactModel.findById(contactId);

    return contact
      ? res.json({ status: 'success', data: { contact } })
      : res.status(404).json('Contact not found');
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removeContact = await contactModel.findByIdAndRemove(contactId);

    return removeContact
      ? res.json({
          status: 'success',
          data: {},
          message: 'Contact delete success',
        })
      : res.status(404).send('User not found');
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const newContact = await contactModel.create(req.body);

    res.json({
      status: 'success',
      data: { newContact },
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await contactModel.findByIdAndUpdate(
      contactId,
      {
        ...req.body,
      },
      {
        new: true,
      },
    );

    return updatedContact
      ? res.status(200).json(updatedContact)
      : res.status(404).send('User not found');
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite = false } = req.body;

    const updatedStatus = await contactModel.findByIdAndUpdate(
      contactId,
      { $set: { favorite } },
      { new: true },
    );

    return updatedStatus
      ? res.status(200).json(updatedStatus)
      : res.status(404).json('Not found');
  } catch (error) {
    next(error);
  }
};

const validateCreateContact = (req, res, next) => {
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const validationResult = createContactRules.validate(req.body);

  if (validationResult.error) {
    const newError = new Error();
    newError.status = 400;
    throw newError;
  }

  next();
};

const validateUpdateContact = (req, res, next) => {
  const updateContactRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).min(1);

  const validationResult = updateContactRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const validateId = (req, res, next) => {
  if (!isValidObjectId(req.params.contactId)) {
    return res.status(400).send('Invalid id');
  }

  next();
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  validateCreateContact,
  validateUpdateContact,
  validateId,
};
