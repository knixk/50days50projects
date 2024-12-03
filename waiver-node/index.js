const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 5050;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.MY_USER,
  password: process.env.MY_PASSWORD,
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

const getCenters = async (con, { center_name = null, days = null } = {}) => {
  let getCentersQuery = "SELECT * FROM centers WHERE 1=1"; // Base query to start with

  // Filter by name if provided
  if (center_name) {
    getCentersQuery += ` AND center_name LIKE '%${center_name}%'`; // Using LIKE for partial matching
  }

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

const generateJWT = async (key) => {
  const user = {
    secretKey: key,
  };
  const token = jwt.sign(user, secretKey, {
    expiresIn: "1h", // expires in one hour
  });
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

app.get("/submissions", async (req, res) => {
  const { mobile_number } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  console.log("token", token);

  if (!token) {
    return res.status(401).json({ message: "Token is required." });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verify token

    // Optional: You can add more checks based on `decoded` content if needed
    console.log("Token Verified:", decoded);

    // Get submissions based on query params
    const filterOptions = { mobile_number }; // Adjust filterOptions as needed
    const result = await getSubmissions(con, filterOptions);

    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Invalid Token:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
});

app.post("/get-token", async (req, res) => {
  const { secret_key } = req.body; // Assuming username and email are provided in the request body

  if (!secret_key) {
    return res.status(400).json({ message: "Secret key required" });
  }

  const token = await generateJWT(secret_key);
  console.log(token);

  res.json({
    token,
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

const getTemplateByCenter = async (con, centerId) => {
  const query = `
    SELECT * 
    FROM templates INNER JOIN centers ON centers.template_id = templates.id
    WHERE centers.id = ?`;

  return new Promise((resolve, reject) => {
    con.query(query, [centerId], (err, result) => {
      if (err) {
        reject(err); // Reject promise on error
      } else {
        resolve(result); // Resolve with the fetched template data
      }
    });
  });
};

app.post("/template-id-from-center", async (req, res) => {
  const { center_id } = req.body;

  const result = await getTemplateByCenter(con, center_id);

  if (!result || !result[0]) {
    return res.sendStatus(404); // Handle undefined or empty result
  }

  res.status(200).json({
    template_id: result[0].template_id,
  });
});

// create submissions
app.post("/submissions", async (req, res) => {
  const { fixed__email, fixed__name, fixed__number } = req.body;

  console.log(req.body);

  const data = {
    template_id: req.body.template_id,
    submission_data: JSON.stringify(req.body),
    name: fixed__name,
    email: fixed__email,
    mobile_number: fixed__number,
  };

  console.log(data);

  postASubmission(con, data);

  res.status(200).json({
    msg: "form was submitted",
  });
});

const postATemplate = (con, data) => {
  const query = `
    INSERT INTO templates (template_name, template_config)
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    con.query(
      query,
      [data.template_name, JSON.stringify(data.template_config)],
      (err, result) => {
        if (err) {
          return reject(err); // Reject if there's an error
        }
        console.log("Inserted ID:", result.insertId);
        console.log("Insertion finished.");
        resolve(result.insertId); // Resolve with the inserted ID
      }
    );
  });
};

app.post("/templates", async (req, res) => {
  const { template_name, template_config } = req.body;

  const data = {
    template_name: template_name,
    template_config: template_config,
  };

  try {
    const ans = await postATemplate(con, data); // Await the result from the template insertion
    console.log(ans, "outside");

    res.status(200).json({
      msg: "Template was saved",
      template_id: ans, // Send the inserted template ID in response
    });
  } catch (err) {
    console.error("Error inserting template:", err);
    res.status(500).json({
      msg: "Error saving template",
      error: err.message,
    });
  }
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

const getTemplates = async (con, { id = null } = {}) => {
  let getTemplatesQuery = `SELECT * FROM templates WHERE id = ?`; // Base query to start with

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

// create a center
app.post("/post-center", async (req, res) => {
  const filterOptions = {
    id: req.body.id,
  };

  const result = await getTemplates(con, filterOptions);
  console.log(result);

  res.status(200).json({
    data: result,
  });
});
