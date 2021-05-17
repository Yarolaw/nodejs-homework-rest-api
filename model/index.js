const fs = require('fs/promises');
const Joi = require('joi');
const path = require('path');
const { v4: uuid } = require('uuid');

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async (req, res) => {
  const data = await fs.readFile(contactsPath, 'utf-8');
  const parseContacs = JSON.parse(data);
  res.send(parseContacs);
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await fs.readFile(contactsPath, 'utf-8');
    const parseContacs = JSON.parse(data);
    const contact = parseContacs.find(contact => contact.id === contactId);
    res.json({
      status: 'success',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const parseContacs = JSON.parse(data);
    const newContacts = parseContacs.filter(
      contact => contact.id !== req.params.contactId,
    );

    const newContactsJson = JSON.stringify(newContacts);

    fs.writeFile(contactsPath, newContactsJson);

    res.json({
      status: 'success',
      data: {},
      message: 'COntact delete success',
    });
  } catch (error) {
    next(error);
  }
};
const addContact = async (req, res, next) => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const parseContacs = JSON.parse(data);
    const newContact = {
      id: uuid(),
      ...req.body,
    };

    const newContacts = [...parseContacs, newContact];

    const newContactsJson = JSON.stringify(newContacts);

    fs.writeFile(contactsPath, newContactsJson);

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
    const data = await fs.readFile(contactsPath, 'utf-8');
    const parseContacs = JSON.parse(data);
    const contactToChange = parseContacs.find(contact => {
      return contact.id === req.params.contactId;
    });

    const newContacts = parseContacs.map(contact => {
      if (contact.id === contactToChange.id) {
        return (contact = {
          id: contactToChange.id,
          ...req.body,
        });
      }
      return contact;
    });

    const newContactsJson = JSON.stringify(newContacts);
    fs.writeFile(contactsPath, newContactsJson);
    res.json({
      statuss: 'success',
      data: {
        contact: {
          id: contactToChange.id,
          ...req.body,
        },
      },
    });
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
  });

  const validBodyReq = req.body.name || req.body.email || req.body.phone;

  const validationResult = updateContactRules.validate(req.body);

  if (!validBodyReq || validationResult.error) {
    const newError = new Error();
    newError.status = 400;
    newError.type = 'UpdateContact';
    throw newError;
  }

  next();
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  validateCreateContact,
  validateUpdateContact,
};
