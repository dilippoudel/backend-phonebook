const phonebookRouter = require('express').Router()
const Contact = require('../models/person')

phonebookRouter.get('/', async (req, res, next) => {
  try {
    const allContacts = await Contact.find({})
    return res.json(allContacts)
  } catch (error) {
    next(error)
  }
})

phonebookRouter.get('/:id', async (req, res, next) => {
  try {
    const person = await Contact.findById(req.params.id)
    res.send(person)
  } catch (error) {
    next(error)
  }
})

// deleting the entry
phonebookRouter.delete('/:id', async (req, res, next) => {
  try {
    await Contact.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

phonebookRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    if (body === undefined) {
      return res.status(400).json({ error: 'content missing' })
    }
    const person = new Contact({
      name: body.name,
      number: body.number,
    })
    await person.save().then((savedPerson) => res.json(savedPerson))
  } catch (error) {
    next(error)
  }
})

phonebookRouter.put('/:id', async (req, res, next) => {
  try {
    const body = req.body
    const newContact = {
      name: body.name,
      number: body.number,
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      newContact,
      { new: true },
    )
    res.json({ updatedContact })
  } catch (error) {
    next(error)
  }
})
module.exports = phonebookRouter
