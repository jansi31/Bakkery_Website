const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "jansi",
  host: "localhost",
  database: "checkoutdb",
  password: "Jansi@2003",
  port: 5432,
});

// Generate professional order ID
async function generateOrderId() {
  // Get date as YYYYMMDD
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dateStr = `${y}${m}${d}`; // 20250902

  // Count orders today
  const result = await pool.query(
    "SELECT COUNT(*) FROM orders WHERE created_at::date = CURRENT_DATE"
  );
  const count = parseInt(result.rows[0].count) + 1; // increment
  const countStr = String(count).padStart(3, "0"); // 001, 002

  return `AC${dateStr}-${countStr}`;
}

// API to save order
app.post("/api/orders", async (req, res) => {
  try {
    const { name, email, address, cart, total } = req.body;

    const order_id = await generateOrderId();

    const result = await pool.query(
      "INSERT INTO orders (order_id, name, email, address, cart, total) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [order_id, name, email, address, JSON.stringify(cart), total]
    );

    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const result = await pool.query(
      "INSERT INTO contacts (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, message]
    );

    res.json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});