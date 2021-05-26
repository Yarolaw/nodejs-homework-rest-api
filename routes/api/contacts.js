const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
  validateCreateContact,
  validateUpdateContact,
  validateId,
} = require('../../model/index');

router.get('/', listContacts);

router.get('/:contactId', validateId, getContactById);

router.post('/', validateCreateContact, addContact);

router.delete('/:contactId', validateId, removeContact);

router.put('/:contactId', validateId, validateUpdateContact, updateContact);
router.patch(
  '/:contactId/favorite',
  validateId,
  validateUpdateContact,
  updateStatusContact,
);

module.exports = router;
