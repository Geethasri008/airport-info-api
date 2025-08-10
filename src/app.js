require("reflect-metadata");
const express = require("express");
const morgan = require("morgan"); 
const { AppDataSource } = require("./data-source");

const airportRoutes = require("./routes/airport");
const app = express();

AppDataSource.initialize()
    .then(() => console.log("📦 Database connected"))
    .catch(err => console.error(err));

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/airport", airportRoutes);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
