const express = require('express');
const router = express.Router();
const { listContacts } = require('../../model/index.js');
let contacts = require('../../model/contacts.json');

router.get('/', listContacts);

router.get('/:contactId', (req, res, next) => {
  const { contactId } = req.params;
  const contact = contacts.filter(el => el.id === contactId);
  console.log(contact);
  res.json({
    status: 'success',
    code: 200,
    data: { contact },
  });
});

router.post('/', (req, res, next) => {
  const { name, email, phone } = req.body;
  const contact = {
    id: 22,
    name,
    email,
    phone,
  };

  contacts.push(contact);

  res.status(201).json({
    status: 'success',
    code: 201,
    data: { contact },
  });
});

router.delete('/:contactId', (req, res, next) => {
  const { contactId } = req.params;
  const newcontacts = contacts.filter(el => el.id !== contactId);
  contacts = [...newcontacts];
  res.status(204).json();
});

router.put('/:contactId', (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const [contact] = contacts.filter(el => el.id === contactId);
  contact.name = name;
  contact.email = email;
  contact.phone = phone;
  res.json({
    status: 'success',
    code: 200,
    data: { contact },
  });
});

module.exports = router;
