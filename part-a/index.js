const http = require("http");
const express = require("express");
let notes = require("./notes.json");
const { brotliDecompressSync } = require("zlib");
const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</hi>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes/", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
    date: new Date(),
  };
  notes = notes.concat(note);
  res.json(note);
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
