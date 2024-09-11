const express = require("express");

const app = express();
app.use(express.json());

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get("/", (request, response) => {
  response.send("<h1>Welcome home!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);

  if (person)
    response.json(person);
  else
    response.status(404).send("Person does not exist!");
});

const generateId = () =>{
  const maxId = persons.length > 0 
    ? Math.floor(Math.random() * 2000)
    : 0;
    return String(maxId + 1);
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!request.body) {
    return response.status(404).json({
      error: "content missing!"
    });
  }

  const person = {
    "id": generateId(),
    "name": body.name,
    "number": body.number
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${(new Date())}</p>
  `);
});

const PORT = 3001

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});