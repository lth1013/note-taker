const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

let data = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

