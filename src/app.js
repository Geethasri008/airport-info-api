require("reflect-metadata");
const express = require("express");
const morgan = require("morgan");
const { AppDataSource } = require("./data-source"); // correct relative path
const airportRoutes = require("./routes/airport");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
AppDataSource.initialize()
  .then(() => console.log("📦 Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Airport Info API! Use /api/airport/:iata_code to get airport details.");
});

// API routes
app.use("/api/airport", airportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
