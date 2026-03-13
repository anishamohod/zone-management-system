// Zone Management System - Single File Project

const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "zone_management"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to MySQL Database");
  }
});


// ------------------- Dashboard Page -------------------

app.get("/", (req, res) => {
  res.send(`
  <h2>Zone Management System</h2>

  <h3>Add Zone</h3>
  <form method="POST" action="/addZone">
      Zone Name: <input name="zone_name" required><br><br>
      Brand ID: <input name="brand_id" type="number" required><br><br>
      <button type="submit">Add Zone</button>
  </form>

  <br>
  <a href="/zones">View Zones Dashboard</a>
  `);
});


// ------------------- Add Zone -------------------

app.post("/addZone", express.urlencoded({ extended: true }), (req, res) => {

  const { zone_name, brand_id } = req.body;

  const sql = "INSERT INTO zones (zone_name, brand_id) VALUES (?, ?)";

  db.query(sql, [zone_name, brand_id], (err) => {
    if (err) {
      res.send("Error adding zone");
    } else {
      res.redirect("/zones");
    }
  });

});


// ------------------- View Zones -------------------

app.get("/zones", (req, res) => {

  const sql = "SELECT * FROM zones WHERE is_active = true";

  db.query(sql, (err, result) => {

    if (err) {
      res.send("Error fetching zones");
      return;
    }

    let table = `
    <h2>Zone Dashboard</h2>
    <table border="1" cellpadding="10">
    <tr>
    <th>ID</th>
    <th>Zone Name</th>
    <th>Brand ID</th>
    <th>Action</th>
    </tr>
    `;

    result.forEach((zone) => {
      table += `
      <tr>
      <td>${zone.zone_id}</td>
      <td>${zone.zone_name}</td>
      <td>${zone.brand_id}</td>
      <td>
      <a href="/deleteZone/${zone.zone_id}">Delete</a>
      </td>
      </tr>
      `;
    });

    table += `</table><br><a href="/">Back</a>`;

    res.send(table);

  });

});


// ------------------- Soft Delete Zone -------------------

app.get("/deleteZone/:id", (req, res) => {

  const sql = "UPDATE zones SET is_active = false WHERE zone_id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      res.send("Error deleting zone");
    } else {
      res.redirect("/zones");
    }
  });

});


// ------------------- Server -------------------

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});