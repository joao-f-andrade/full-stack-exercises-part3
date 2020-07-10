const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
//Logs the requests and its content
morgan.token('param', function(req, res) {
    return req.method==='POST'?JSON.stringify(req.body):''
});

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param'))
let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov',
        number: '12-43-234345',
        id: 3
    }, {
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
        id: 4
    },
]
//Funtion Generate ID
generateID = () => {
    id = Math.ceil(Math.random()*10000000)
    return id
}

//Method for info
app.get('/info', (req, res) => {
    const response = `<p>Phonebook has info for ${persons.length} people</p>
<p>${Date()}</p>`
    console.log(response)
    res.send(response)
})
//Gets persons JSON
app.get('/api/persons', (req, res) => {
    console.log(persons)
    res.json(persons)
})
//Gets info person.id
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => `${person.id}` === id)
    console.log(person)
    person ?
        res.json(person)
        : res.status(404).end()
})
//Delete person
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    console.log(id,)
    persons = persons.filter(person => `${person.id}` !== id)
    
    res.status(204).end()
})
//Add person
app.post('/api/persons', (req, res)  =>  {
    const person = req.body
    if(!person.number || !person.name ) {
        const reason = person.number?'name':'number'
        return res.status(400).json({error: `${reason} is missing`})
    }
    repeated = persons.filter((old)=>old.name ===person.name )
    if (repeated.length>0) {
        return  res.status(400).json({error: 'name must be unique'})
    }

    person.id= generateID()
    persons = persons.concat(person)
    console.log('new person:',person)


    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`)
})