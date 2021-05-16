// const fs = require('fs/promises');
const contacts = require('./contacts.json');

const listContacts = async (req, res) => {
  res.status(200).json(contacts);
};

const getContactById = async (contactId, req, res) => {};

// const removeContact = async contactId => {};

// const addContact = async body => {};

// const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  // removeContact,
  // addContact,
  // updateContact,
};
