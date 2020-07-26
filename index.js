const express = require("express");
const cors = require("cors");
const app = express();
var persons = require("./db.json");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const date = new Date().toString();
  res.send(`Phonebook has info for ${persons.length} people <br/><br/>${date}`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons).status(200);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  person
    ? res.json(person)
    : res.status(400).json({ error: "entry with that id does not exist" });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const maxId = Math.max(...persons.map(p => p.id));
  if (
    persons.some(
      person => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return res.status(400).json({ error: "name must be unique" });
  } else if (
    typeof body.name === "undefined" ||
    typeof body.number === "undefined" ||
    body.name.length < 2 ||
    body.number.length < 2
  ) {
    return res.status(400).json({ error: "must inlcude name and number" });
  } else {
    const person = {
      id: maxId + 1,
      name: body.name,
      number: body.number
    };
    persons = persons.concat(person);
    res.json(person);
  }
});

app.put("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  if (!persons.some(person => person.id === id)) {
    return res.status(400).json({ error: "id not found" });
  } else if (
    typeof body.name === "undefined" ||
    typeof body.number === "undefined" ||
    body.name.length < 2 ||
    body.number.length < 2
  ) {
    return res.status(400).json({ error: "must inlcude name and number" });
  } else {
    const person = {
      id: id,
      name: body.name,
      number: body.number
    };
    persons = persons.concat(person);
    res.json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.json({ success: `id = ${id} was deleted` });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
