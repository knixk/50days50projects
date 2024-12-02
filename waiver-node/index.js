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

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

// Controllers
const postASubmission = async (con, data) => {
  const query = `
    INSERT INTO submissions (template_id, submission_data, name, email, mobile_number)
    VALUES (?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    con.query(query, [
      data.template_id,
      data.submission_data,
      data.name,
      data.email,
      data.mobile_number,
    ], (err, result) => {
      if (err) {
        console.error("Error inserting submission:", err);
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const postATemplate = (con, data) => {
  const query = `
    INSERT INTO templates (template_name, template_config)
    VALUES (?, ?)
  `;
  return new Promise((resolve, reject) => {
    con.query(query, [data.template_name, JSON.stringify(data.template_config)], (err, result) => {
      if (err) {
        console.error("Error inserting template:", err);
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const postACenter = (con, data) => {
  const query = `
    INSERT INTO centers (center_name, address, contact_info, template_id)
    VALUES (?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    con.query(query, [
      data.center_name,
      data.address,
      JSON.stringify(data.contact_info),
      data.template_id,
    ], (err, result) => {
      if (err) {
        console.error("Error inserting center:", err);
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const getSubmissions = async (con, { name, mobile_number, email, days }) => {
  let query = "SELECT * FROM submissions WHERE 1=1";

  if (name) query += ` AND name LIKE '%${name}%'`;
  if (mobile_number) query += ` AND mobile_number LIKE '%${mobile_number}%'`;
  if (email) query += ` AND email LIKE '%${email}%'`;
  if (days) query += ` AND submission_date >= CURDATE() - INTERVAL ${days} DAY`;

  return new Promise((resolve, reject) => {
    con.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching submissions:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getCenters = async (con, { center_name, days }) => {
  let query = "SELECT * FROM centers WHERE 1=1";

  if (center_name) query += ` AND center_name LIKE '%${center_name}%'`;
  if (days) query += ` AND updated_at >= CURDATE() - INTERVAL ${days} DAY`;

  return new Promise((resolve, reject) => {
    con.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching centers:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getTemplateByCenter = async (con, centerId) => {
  const query = `
    SELECT * 
    FROM templates 
    INNER JOIN centers ON centers.template_id = templates.id
    WHERE centers.id = ?
  `;
  return new Promise((resolve, reject) => {
    con.query(query, [centerId], (err, result) => {
      if (err) {
        console.error("Error fetching template by center:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// Database connection
con.connect(err => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("MySQL DB connected!");
  con.query("USE waiver_form;", (err, result) => {
    if (err) {
      console.error("Error selecting database:", err);
      process.exit(1);
    }
    console.log("Selected DB: waiver_form");
  });
});

// Routes
app.get("/submissions", async (req, res) => {
  try {
    const { mobile_number, name, email, days } = req.query;
    const filterOptions = { mobile_number, name, email, days };
    const result = await getSubmissions(con, filterOptions);
    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error in /submissions route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/templates", async (req, res) => {
  try {
    const { id } = req.query;
    const result = await getTemplates(con, { id });
    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error in /templates route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/centers", async (req, res) => {
  try {
    const { center_name, days } = req.query;
    const filterOptions = { center_name, days };
    const result = await getCenters(con, filterOptions);
    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error in /centers route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/template-id-from-center", async (req, res) => {
  try {
    const { center_id } = req.body;
    const result = await getTemplateByCenter(con, center_id);
    if (result && result.length > 0) {
      res.status(200).json({ template_id: result[0].template_id });
    } else {
      res.status(404).json({ error: "Center not found" });
    }
  } catch (err) {
    console.error("Error in /template-id-from-center route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/submissions", async (req, res) => {
  try {
    const { fixed__email, fixed__name, fixed__number, template_id } = req.body;
    const data = {
      template_id,
      submission_data: JSON.stringify(req.body),
      name: fixed__name,
      email: fixed__email,
      mobile_number: fixed__number,
    };
    await postASubmission(con, data);
    res.status(200).json({ msg: "Form was submitted" });
  } catch (err) {
    console.error("Error in /submissions route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/templates", async (req, res) => {
  try {
    const data = {
      template_name: "party template",
      template_config: template_config,
    };
    await postATemplate(con, data);
    res.status(200).json({ msg: "Template was saved" });
  } catch (err) {
    console.error("Error in /templates route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/centers", async (req, res) => {
  try {
    const { center_name, center_address, contact_info, template_id } = req.body;
    const data = { center_name, address: center_address, contact_info, template_id };
    await postACenter(con, data);
    res.status(200).json({ msg: "Center was saved" });
  } catch (err) {
    console.error("Error in /centers route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App running on port: ${port}..`);
});
