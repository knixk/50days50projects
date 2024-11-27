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

const postASubmission = (con, data) => {
  const query = `
    INSERT INTO submissions (template_id, event_id, submission_data, name, email, mobile_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  con.query(
    query,
    [
      data.template_id,
      data.event_id,
      data.submission_data,
      data.name,
      data.email,
      data.mobile_number,
    ],
    (err, result) => {
      if (err) throw err;
      console.log("Inserted ID:", result.insertId);
    }
  );

  console.log("insertion finished..");
};

const getSubmissions = (con, id = NULL) => {
  const getSubmissionsQuery =
    id != NULL
      ? `select * from submissions where id = ${id};`
      : "select * from submissions;";
};

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});

app.get("/submissions", (req, res) => {
  getSubmissions(con);
  // res.send("hello word").status(200);
});

// write an api to put data in db

// write an api to query data from db
app.post("/submissions", (req, res) => {
  const data = {
    template_id: 1,
    event_id: 2,
    submission_data: JSON.stringify({ answer: "Example Answer" }),
    name: "John Doe",
    email: "john@example.com",
    mobile_number: "1234567890",
  };

  postASubmission(con, data);

  /*
  res.status(200).json({
    msg: "form was submitted",
  });
  */
});
