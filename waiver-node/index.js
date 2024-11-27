const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 5050;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gamer12345!",
});

const selectDB = "use waiver_form;";
const getSubmissions = "select * from submissions;";

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  let res = con.query(selectDB, function (err, result) {
    if (err) throw err;
    // console.log("Result: " + result);
  });

  let submissions = con.query(getSubmissions);
  if (!submissions) {
    console.error("err");
  }

  console.log(submissions);
});

app.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});

app.get("/", (req, res) => {
  res.send("hello word").status(200);
});

// write an api to put data in db

// write an api to query data from db
app.post("/submit", (req, res) => {
  res.status(200).json({
    msg: "form was submitted",
  });
});
