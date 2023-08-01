const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Read data from the db.json file
const readData = () => {
  const data = fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8");
  return JSON.parse(data);
};

// Write data to the db.json file
const writeData = (data) => {
  fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(data));
};

// Get all notes
app.get("/api/notes", function (req, res) {
  const data = readData();
  res.json(data);
});

// Save a new note
app.post("/api/notes", function (req, res) {
  const newNote = req.body;
  const data = readData();
  newNote.id = data.length.toString();
  data.push(newNote);
  writeData(data);
  console.log("Note saved to db.json. Content: ", newNote);
  res.json(data);
});

// Delete a note
app.delete("/api/notes/:id", function (req, res) {
  const noteId = req.params.id;
  let data = readData();
  data = data.filter((note) => note.id !== noteId);
  writeData(data);
  console.log("Note deleted from db.json. ID: ", noteId);
  res.json(data);
});

// Route for notes.html page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Route for index.html page and any other unmatched routes
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// 404 Error handler
app.use(function (req, res, next) {
  res.status(404).send("404 - Not Found");
});

app.listen(PORT, function () {
  console.log("The server is listening on " + PORT);
});
