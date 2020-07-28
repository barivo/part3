require('dotenv').config()
const Person = require('./models/people')
const express = require('express')
const cors = require('cors')
const app = express()
var persons = []

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  const date = new Date().toString()
  res.send(`Phonebook has info for ${persons.length} people <br/><br/>${date}`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        console.log('id not does not exist on the server')
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (
    persons.some(
      person => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return res.status(400).json({ error: 'name must be unique' })
  } else if (
    typeof body.name === 'undefined' ||
    typeof body.number === 'undefined' ||
    body.name.length < 2 ||
    body.number.length < 2
  ) {
    return res.status(400).json({ error: 'must inlcude name and number' })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person
      .save()
      .then(savedPerson => savedPerson.toJSON())
      .then(savedAndFormattedPerson => {
        console.log('person saved!')
        res.json(savedAndFormattedPerson)
      })
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  if (
    typeof body.name === 'undefined' ||
    typeof body.number === 'undefined' ||
    body.name.length < 2 ||
    body.number.length < 2
  ) {
    return res.status(400).json({ error: 'must inlcude name and number' })
  } else {
    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(id, person, {
      new: true,
      runValidators: true,
      context: 'query'
    })
      .then(updatedPerson => {
        console.log('person updated!')
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  }
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(result =>
      res
        .json({ success: `id = ${id} was deleted` })
        .status(204)
        .end()
    )
    .catch(error => next(error))
})

// errorHandler should follow unknownEndpoint definition and call
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('Inside errorHandler ', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'InvalidName') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
