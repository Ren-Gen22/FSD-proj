const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
let dbConnected = false;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
(async () => {
  try {
    await pool.connect();
    console.log("Database connection successful.");
    dbConnected = true;
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1); // Exit the application if DB connection fails
  }
})();

app.use(cors());
app.use(bodyParser.json());

// POST route to add employees
app.post("/employees", async (req, res) => {
  const {
    name,
    employee_id,
    email,
    phone_number,
    department,
    date_of_joining,
    role,
  } = req.body;

  // Check if the database connection is live
  if (!dbConnected) {
    return res.status(500).json({
      message:
        "Database connection is not established. Please try again later.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO form (name, employee_id, email, phone_number, department, date_of_joining, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        employee_id,
        email,
        phone_number,
        department,
        date_of_joining,
        role,
      ],
    );

    console.log("New employee added:", result.rows[0]);

    res.status(201).json({
      message: "Employee added successfully",
      employee: result.rows[0],
    });
  } catch (error) {
    console.error("Error while adding employee:", error.message);

    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Employee ID or Email already exists" });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Server startup
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
