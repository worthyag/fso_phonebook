const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    (tokens.method(req, res) === "POST") 
      ? JSON.stringify(req.body) : ""
  ].join(' ');
}));

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

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "info missing!"
    });
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(404).json({
      error: "name must be unique!"
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});