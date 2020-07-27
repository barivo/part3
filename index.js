require("dotenv").config();
const Person = require("./models/people");
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { response } = require("express");
var persons = [];

// var persons = require("./db.json");

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
  Person.find({}).then((people) => {
    res.json(people);
  });
  // res.json(persons).status(200);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => console.log("id not found", error));
  // const person = persons.find((person) => person.id === id);
  // person
  //   ? res.json(person)
  //   : res.status(400).json({ error: "entry with that id does not exist" });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  // const maxId = Math.max(...persons.map((p) => p.id));
  const newId = Math.random().toString().slice(2);
  if (
    persons.some(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
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
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => {
      console.log("person saved!");
      res.json(savedPerson);
    });
  }
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  if (
    typeof body.name === "undefined" ||
    typeof body.number === "undefined" ||
    body.name.length < 2 ||
    body.number.length < 2
  ) {
    return res.status(400).json({ error: "must inlcude name and number" });
  } else {
    const person = {
      name: body.name,
      number: body.number,
    };
    Person.findByIdAndUpdate(id, person, { new: true }).then((result) => {
      res.json(person);
      console.log(person);
      console.log("person updated!");
    });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id).then((result) =>
    res
      .json({ success: `id = ${id} was deleted` })
      .status(204)
      .end()
  );
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
