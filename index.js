const { json } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]
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
  res.json(persons)
})

// getting single person info
app.get('/api/persons/:id', (req, res) => {
  let id = req.params.id
  const findPersons = persons.find((person) => person.id === Number(id))
  if (!findPersons) {
    res.status(404).send()
  }
  res.send(findPersons)
})

// deleting the entry
app.delete('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id)
  persons.filter((person) => person.id !== id)
  res.status(204).end()
})

// creating a contact
app.post('/api/persons', (req, res) => {
  let id = Math.floor(Math.random() * (10000000000 - 4))
  let newContact = req.body
  newContact.id = id

  persons.concat(newContact)
  res.json(newContact)
})

const port = 3001
app.listen(port)
