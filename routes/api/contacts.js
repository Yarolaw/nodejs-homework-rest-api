const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  validateCreateContact,
  validateUpdateContact,
} = require('../../model/index');

router.get('/', listContacts);

router.get('/:contactId', getContactById);

router.post('/', validateCreateContact, addContact);

router.delete('/:contactId', removeContact);

router.put('/:contactId', validateUpdateContact, updateContact);

module.exports = router;
