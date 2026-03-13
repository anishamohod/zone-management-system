app.post("/addZone", (req, res) => {
  const { zone_name, brand_id } = req.body;

  const sql = "INSERT INTO zones (zone_name, brand_id) VALUES (?, ?)";

  db.query(sql, [zone_name, brand_id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Zone added successfully");
    }
  });
});