const express = require('express')
const app = express()

app.use(express.json())
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
    const person = persons.filter(person => `${person.id}` !== id)
    console.log(person)
    
    res.status(204).end()
})
//Add person
app.post('/api/persons', (req, res)  =>  {
    const person = req.body
    if(!person.number || !person.name) {
        const reason = person.number?'name':'number'
        return res.status(400).json({error: `${reason} is missing`})
    }
    repeated = persons.filter((old)=>old.name ===person.name )
    console.log(repeated)
    if (repeated) {
      return  res.status(400).json({error: 'name must be unique'})
    }

    person.id= generateID()
    persons = persons.concat(person)
    console.log('person',person)


    res.json(person)
})

const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})