require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const Contact = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
morgan.token('body', (req) =>
  JSON.stringify({ name: req.body.name, number: req.body.number }),
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.get('/persons', (req, res) => {
  res.send('<h1>Everything is okey</h1>')
})

app.get('/api/persons', async (req, res, next) => {
  try {
    const allContacts = await Contact.find({})
    return res.json(allContacts)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Contact.findById(req.params.id)
    res.send(person)
  } catch (error) {
    next(error)
  }
})

// deleting the entry
app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Contact.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
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

app.put('/api/persons/:id', async (req, res, next) => {
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

const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' }).end()
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
// eslint-disable-next-line no-undef
const port = process.env.PORT

app.listen(port)
