require("reflect-metadata");
const express = require("express");
const morgan = require("morgan");
const { AppDataSource } = require("./data-source");
const airportRoutes = require("./routes/airport");
const importData = require("./importSpreadsheet");

const app = express();

AppDataSource.initialize()
    .then(async () => {
        console.log("📦 Database connected");

        const Airport = require("./entities/Airport");
        const airportRepo = AppDataSource.getRepository(Airport);

        const count = await airportRepo.count();
        if (count === 0) {
            console.log("📥 No data found in DB. Importing...");
            await importData();
        }

        app.use(express.json());
        app.use(morgan("dev"));

        // Root route
        app.get("/", (req, res) => {
            res.send("Welcome to the Airport Info API! Use /api/airport/:iata_code to get airport details.");
        });

        app.use("/api/airport", airportRoutes);

        app.listen(3000, () => console.log("🚀 Server running on port 3000"));
    })
    .catch(err => console.error(err));
