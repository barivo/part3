require("dotenv").config();
const Person = require("./models/people");
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { response } = require("express");
var persons = [];

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
  Person.find({}).then(people => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        console.log("id not does not exist on the server");
        res.status(404).end();
      }
    })
    .catch(error => {
      console.log(
        "start of error message **********************************\n",
        error
      );
      console.log(
        "end   of error message **********************************\n"
      );
      res
        .status(400)
        .send({ error: "malformed id" })
        .end();
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const newId = Math.random()
    .toString()
    .slice(2);
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
    const person = new Person({
      name: body.name,
      number: body.number
    });

    person.save().then(savedPerson => {
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
      number: body.number
    };
    Person.findByIdAndUpdate(id, person, { new: true }).then(result => {
      res.json(person);
      console.log(person);
      console.log("person updated!");
    });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id).then(result =>
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
