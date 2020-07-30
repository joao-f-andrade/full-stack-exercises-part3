require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(cors())
app.use(express.static('build'))
//Logs the requests and its content
morgan.token('param', function (req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
});
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param'))

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    }
]

//Method for info
app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        const response = `<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`
        console.log(response)
        res.send(response)
    })

})
//Gets persons JSON
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})
//Gets info person.id
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
})
//Delete person
app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})
//Add person
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => {
            next(error)
        })
})

//Update person
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true})
        .then(updatedPerson => {
            if (updatedPerson === null) {
                res.status(400).send({ error: 'format invalid' })
            } else {
                console.log(updatedPerson)
                res.json(updatedPerson)
            }
        })
        .catch(error => next(error))
})

// For when the request is not defined
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log('error é', error)
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
console.log(PORT)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})