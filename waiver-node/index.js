const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 5050;
const template_config = require("./template_config.json");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gamer12345!",
});

const secretKey = process.env.SECRET_KEY;

// controllers
const postASubmission = (con, data) => {
  return new Promise((resolve, reject) => {
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
        if (err) return reject(err);
        // this is the submission id, we want the template id
        resolve(result.insertId);
      }
    );
  });
};

const postATemplate = (con, data) => {
  const query = `
    INSERT INTO templates (template_name, template_config)
    VALUES (?, ?)
  `;

  con.query(
    query,
    [data.template_name, JSON.stringify(data.template_config)], // Ensure JSON is stringified
    (err, result) => {
      if (err) throw err;
      console.log("Inserted ID:", result.insertId);
      console.log("Insertion finished.");
    }
  );
};

const postACenter = (con, data) => {
  const query = `
    INSERT INTO centers (center_name, address, contact_info, template_id)
    VALUES (?, ?, ?, ?)
  `;

  con.query(
    query,
    [
      data.center_name,
      data.address,
      JSON.stringify(data.contact_info),
      data.template_id,
    ], // Ensure JSON is stringified
    (err, result) => {
      if (err) throw err;
      console.log("Inserted ID:", result.insertId);
      console.log("Insertion finished.");
    }
  );
};

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
    getSubmissionsQuery += ` AND mobile_number LIKE '%${mobile_number}%'`;
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

const getTemplates = async (
  con,
  { template_name = null, days = null, id = null } = {}
) => {
  let getTemplatesQuery = `SELECT * FROM templates WHERE id = ?`; // Base query to start with

  // Filter by name if provided
  // if (template_name) {
  //   getTemplatesQuery += ` AND template_name LIKE '%${template_name}%'`; // Using LIKE for partial matching
  // }

  // Filter by submission date range if provided
  // if (days) {
  //   getTemplatesQuery += ` AND updated_at >= CURDATE() - INTERVAL ${days} DAY`;
  // }

  // if (id) {
  //   getTemplatesQuery += `AND id LIKE '%${id}%`;
  // }
  console.log("template fetch was run");
  return new Promise((resolve, reject) => {
    con.query(getTemplatesQuery, [id], (err, result, fields) => {
      if (err) {
        reject(err); // Reject promise on error
      } else {
        resolve(result); // Resolve promise with the result
      }
    });
  });
};

const getCenters = async (con, { center_name = null, days = null } = {}) => {
  let getCentersQuery = "SELECT * FROM centers WHERE 1=1"; // Base query to start with

  // Filter by name if provided
  if (center_name) {
    getCentersQuery += ` AND center_name LIKE '%${center_name}%'`; // Using LIKE for partial matching
  }

  // Filter by submission date range if provided
  // if (days) {
  //   getCentersQuery += ` AND updated_at >= CURDATE() - INTERVAL ${days} DAY`;
  // }

  return new Promise((resolve, reject) => {
    con.query(getCentersQuery, (err, result, fields) => {
      if (err) {
        reject(err); // Reject promise on error
      } else {
        console.log(result[0].template_id);
        resolve(result); // Resolve promise with the result
      }
    });
  });
};

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const generateJWT = async (req) => {
  const { mobile_number } = req.query;
  // console.log(mobile_number, "log?");
  const user = {
    user_id: mobile_number,
  };
  const token = jwt.sign(user, secretKey);
  // res.json({ token });
  return token;
};

// connect db
con.connect(function (err) {
  if (err) throw err;
  console.log("mysql db connected!");

  const selectDB = "use waiver_form;";

  con.query(selectDB, (err, result) => {
    if (err) throw err;
    console.log(`Selected DB waiver_form`);
  });
});

// Middleware to parse JSON body
app.use(express.json());

app.use(cors());

app.listen(port, () => {
  console.log(`app running on port: ${port}..`);
});

// routes
// get all the submissions and add filters
app.get("/submissions", async (req, res) => {
  const { mobile_number } = req.query;
  // const tkn = generateJWT(req);
  // console.log(tkn)
  // console.log(mobile_number);

  // const { name = null, mobile_number, days = null } = req.body;

  // get this from query params
  const filterOptions = {
    // name: name,
    mobile_number: mobile_number,
    // days: days,
  };

  // const token = generateJWT(req);
  // console.log("token =====> ", token);

  // invalid token - synchronous
  try {
    var decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    console.log("verified token..");
  } catch (err) {
    // err
    console.error("wrong");
  }


  if (!decoded) {
    res.send(401)
    return;
  }
  const result = await getSubmissions(con, filterOptions);

  res.status(200).json({
    data: result,
  });
});

// get all the templates
app.get("/templates", async (req, res) => {
  console.log(req.body);
  // get this from query params
  const filterOptions = {
    id: 1,
  };

  const result = await getTemplates(con, filterOptions);

  res.status(200).json({
    data: result,
  });
});

// get all the templates
app.get("/centers", async (req, res) => {
  // get this from query params
  const filterOptions = {
    center_name: "game",
    days: 2,
  };

  const result = await getCenters(con, filterOptions);

  res.status(200).json({
    data: result,
  });
});

// get all the templates
app.get("/template-id-from-center", async (req, res) => {
  console.log(req.body);
  // get this from query params
  const filterOptions = {
    center_name: "game",
    days: 2,
  };

  const result = await getCenters(con, filterOptions);

  res.status(200).json({
    template_id: result[0].template_id,
  });
});

// create submissions
app.post("/submissions", async (req, res) => {
  const { fixed__email, fixed__name, fixed__number } = req.body.submission_data;
  console.log(fixed__email);

  const data = {
    template_id: req.body.template_id,
    submission_data: JSON.stringify(req.body.submission_data),
    name: fixed__name,
    email: fixed__email,
    mobile_number: fixed__number,
  };

  postASubmission(con, data);

  res.status(200).json({
    msg: "form was submitted",
  });
});

// create templates
app.post("/templates", async (req, res) => {
  const data = {
    template_name: "party template",
    template_config: template_config,
  };

  postATemplate(con, data);

  res.status(200).json({
    msg: "template was saved",
  });
});

// create a center
app.post("/centers", async (req, res) => {
  console.log(req.body);

  const data = {
    center_name: req.body.center_name,
    address: req.body.center_address,
    contact_info: req.body.contact_info,
    template_id: req.body.template_id,
  };

  postACenter(con, data);

  res.status(200).json({
    msg: "center was saved",
  });
});

// create a center
app.post("/post-center", async (req, res) => {
  // console.log(req.body.id);
  // get this from query params
  const filterOptions = {
    id: req.body.id,
  };

  const result = await getTemplates(con, filterOptions);
  console.log(result);

  res.status(200).json({
    data: result,
  });
});
