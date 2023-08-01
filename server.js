const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

let data = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
// gets the notes page from the public folder and sends it to the client
app.get("api/notes", function (req, res) {
  data = res.sendFile(path.join(__dirname, "db/db.json"));
  data = JSON.parse(data);
  res.json(data);
});
// posts the notes to the db.json file
app.post("api/notes", function (req, res) {
    // reads the db.json file
  data = fs.readFileSync(path.join(__dirname, "db/db.json"));
  // parses the data
  data = JSON.parse(data);
  // adds the id to the note
  req.body.id = data.length;
  // pushes the note to the data array
  data.push(req.body);
  // writes the data to the db.json file
  data = JSON.stringify(data);

  // writes the data to the db.json file
  fs.writeFile(path.join(__dirname, "db/db.json"), data, function (err) {
    if (err) throw err;
    // sends the data to the client
    res.json(JSON.parse(data));

  });
});

// this app.get is for the notes.html page and sends it to the client
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "develop/public/notes.html"));
});
// this app.get is for the index.html page and sends it to the client
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "develop/public/index.html"));
});
// this app.get is for the db.json file and sends it to the client
app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "develop/db/db.json"));
});

app.post("/api/notes", function (req, res) {
  // newNote is the user input
  let newNote = req.body;
  // noteList is the db.json file
  let noteList = JSON.parse(fs.readFileSync("./develop/db/db.json", "utf8"));
  // noteId is the length of the noteList array
  let noteId = noteList.length.toString();
  // newNote.id is the noteId
  newNote.id = noteId;
  // push the newNote to the noteList
  noteList.push(newNote);
  // write the noteList to the db.json file
  fs.writeFileSync("./develop/db/db.json", JSON.stringify(noteList));
  console.log("Note saved to db.json. Content: ", newNote);
  // return the noteList to the client
  res.json(noteList);
});

app.listen(PORT, function () {
  console.log("The server is listening on " + PORT);
});
