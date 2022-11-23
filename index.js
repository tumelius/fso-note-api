const cors = require('cors')
const express = require('express')
const { requestLogger } = require('./requestLogger')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>This is the great notes API!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = request.body
  note.id = id
  
  notes = notes.map(note => {
    if (note.id === id) {
      note.important = !note.important
    }
    return note
  })
  response.json(note)
})


const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {

  const noteBody = request.body

  if (!noteBody.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: noteBody.content,
    important: noteBody.important || false,
    date: new Date(),
    id: generateId(),
  }
  console.log('New note:', note)


  notes = notes.concat(note)
  console.log('New notes:', notes)
  
  response.json(note)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})