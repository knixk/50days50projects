const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

// MySQL Connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gamer12345!",
});

const secretKey = process.env.SECRET_KEY || "defaultSecretKey";

// Connect to MySQL Database
con.connect(function (err) {
  if (err) throw err;
  console.log("MySQL DB connected!");

  const selectDB = "USE waiver_form;";
  con.query(selectDB, (err) => {
    if (err) throw err;
    console.log("Selected DB waiver_form");
  });
});

// Middleware
app.use(express.json());
app.use(cors());

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Generate JWT Token
app.post("/login", (req, res) => {
  const { mobile_number } = req.body;

  if (!mobile_number) {
    return res.status(400).json({ error: "Mobile number is required" });
  }

  const token = jwt.sign({ mobile_number }, secretKey, { expiresIn: "1h" });
  res.json({ token });
});

// Controllers
const getSubmissions = async (
  con,
  { name = null, mobile_number = null, email = null, days = null } = {}
) => {
  let query = "SELECT * FROM submissions WHERE 1=1";

  if (name) query += ` AND name LIKE '%${name}%'`;
  if (mobile_number) query += ` AND mobile_number LIKE '%${mobile_number}%'`;
  if (email) query += ` AND email LIKE '%${email}%'`;
  if (days) query += ` AND submission_date >= CURDATE() - INTERVAL ${days} DAY`;

  return new Promise((resolve, reject) => {
    con.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Routes
app.get("/submissions", authenticateToken, async (req, res) => {
  const { name, mobile_number, email, days } = req.query;
  const filterOptions = { name, mobile_number, email, days };

  try {
    const result = await getSubmissions(con, filterOptions);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
