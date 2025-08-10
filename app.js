require("reflect-metadata");
const express = require("express");
const { AppDataSource } = require("./data-source");
const airportRouter = require("./routes/airport");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Register airport routes under /api/airport
app.use("/api/airport", airportRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
