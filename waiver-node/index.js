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

// const getSubmissions = async (con, id = null) => {
//   const getSubmissionsQuery = "select * from submissions;";

//   let res;

//   await con.query(getSubmissionsQuery, async function (err, result, fields) {
//     if (err) throw err;
//     console.log("=========>");
//     console.log("result: ", result);
//     console.log("=========>");

//     res = await result;
//   });

//   return res;
// };

const getSubmissions = async (
  con,
  { name = null, mobile_number = null, email = null, days = null } = {}
) => {
  let getSubmissionsQuery = "SELECT * FROM submissions WHERE 1=1"; // Base query to start with

  // Filter by name if provided
  if (name) {
    getSubmissionsQuery += ` AND name LIKE '%${name}%'`; // Using LIKE for partial matching
  }

  // Filter by mobile_number if provided
  if (mobile_number) {
    getSubmissionsQuery += ` AND mobile_number LIKE '${mobile_number}'`;
  }

  // Filter by email if provided
  if (email) {
    getSubmissionsQuery += ` AND email LIKE '%${email}%'`; // Using LIKE for partial matching
  }

  // Filter by submission date range if provided
  if (days) {
    getSubmissionsQuery += ` AND submission_date >= CURDATE() - INTERVAL ${days} DAY`;
  }

  return new Promise((resolve, reject) => {
    con.query(getSubmissionsQuery, (err, result, fields) => {
      if (err) {
        reject(err); // Reject promise on error
      } else {
        resolve(result); // Resolve promise with the result
      }
    });
  });
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
  const filterOptions = {
    name: "Doe",
    mobile_number: '1234',
  };

  const result = await getSubmissions(con, filterOptions);

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
    mobile_number: 1234,
  };

  postASubmission(con, data);

  res.status(200).json({
    msg: "form was submitted",
  });
});
