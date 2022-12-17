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
morgan.token('body', (req, res) =>
  JSON.stringify({ name: req.body.name, number: req.body.number }),
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.get('/persons', (req, res) => {
  res.send('<h1>Everything is okey</h1>')
})
// getting info
app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info ${persons.length} people <br/>
    ${new Date()}
  </p>`)
})

// get all contacts
app.get('/api/persons', (req, res) => {
  Contact.find({}).then((person) => {
    res.json(person)
  })
})

// getting single person info
app.get('/api/persons/:id', async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (contact) {
    res.send(contact)
  } else {
    res.status(404).end()
  }
})

// deleting the entry
app.delete('/api/persons/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// creating a contact
app.post('/api/persons', (req, res) => {
  const body = req.body
  if (body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
  const person = new Contact({
    name: body.name,
    number: body.number,
  })
  person.save().then((savedPerson) => res.json(savedPerson))
})

// updating the contact
app.put('/api/persons/:id', async (req, res) => {
  const newContact = Contact.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    (err) => {
      if (err) return res.json({ error: 'Could not update, sth wrong' })
      res.send('Contact updated')
    },
  )
})

const port = process.env.PORT

app.listen(port)
