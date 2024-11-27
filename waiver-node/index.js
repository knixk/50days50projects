const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 5050;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gamer12345!",
});

const postASubmission = (con, data) => {
  const query = `
    INSERT INTO submissions (template_id, submission_data, name, email, mobile_number)
    VALUES (?, ?, ?, ?, ?)
  `;

  con.query(
    query,
    [
      data.template_id,
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

const getSubmissions = async (con, id = null) => {
  // const getSubmissionsQuery =
  //   id != NULL
  //     ? `select * from submissions where id = ${id};`
  //     : "select * from submissions;";

  const getSubmissionsQuery = "select * from submissions;";

  // con.query(getSubmissionsQuery, (err, result) => {
  //   if (err) throw err;
  //   console.log("Inserted ID:", result);
  // });

  let res;

  await con.query(getSubmissionsQuery, async function (err, result, fields) {
    if (err) throw err;
    console.log("=========>");
    console.log("result: ", result);
    console.log("=========>");

    res = await result;
  });

  return res;
};

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  const selectDB = "use waiver_form;";

  con.query(selectDB, (err, result) => {
    if (err) throw err;
    console.log(`Selected DB waiver_form`);
  });
});

app.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});

// write an api to query data from db
app.get("/submissions", async (req, res) => {
  const result = await getSubmissions(con);

  res.status(200).json({
    data: result,
  });
});

// write an api to put data in db
app.post("/submissions", async (req, res) => {
  const data = {
    template_id: 2,
    submission_data: JSON.stringify({ answer: "Example Answer" }),
    name: "John D23asdoe",
    email: "jasdohn@exsdample.com",
    mobile_number: "12345267890",
  };

  postASubmission(con, data);

  res.status(200).json({
    msg: "form was submitted",
  });
});
