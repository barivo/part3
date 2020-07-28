const Person = require("../models/people");
const personRouter = require("express").Router();
var persons = [];

personRouter.get("/", (req, res) => {
  Person.find({}).then(people => {
    res.json(people);
  });
});

personRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

personRouter.post("/", (req, res, next) => {
  const body = req.body;
  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson);
    })
    .catch(error => next(error));
});

personRouter.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query"
  })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

personRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(result => res.status(204).end())
    .catch(error => next(error));
});

module.exports = personRouter;
