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
  data = fs.readFileSync(path.join(__dirname, "db/db.json"));
  data = JSON.parse(data);
  req.body.id = data.length;
  data.push(req.body);
  data = JSON.stringify(data);
  fs.writeFile(path.join(__dirname, "db/db.json"), data, function (err) {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

