// src/importSpreadsheet.js
const path = require("path");
const xlsx = require("xlsx");
const { AppDataSource } = require("./data-source");
const Airport = require("./entities/Airport");
const City = require("./entities/City"); // Make sure this exists

async function importData() {
    const filePath = path.join(__dirname, "Database.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const airportRepo = AppDataSource.getRepository(Airport);
    const cityRepo = AppDataSource.getRepository(City);

    for (const row of rows) {
        if (!row.icao_code) {
            console.warn(`Skipping row: ICAO code missing`);
            continue;
        }

        if (row.city_id) {
            const cityExists = await cityRepo.findOne({ where: { id: row.city_id } });
            if (!cityExists) {
                console.warn(`Skipping airport: city_id ${row.city_id} not found`);
                continue;
            }
        }

        const airport = airportRepo.create({
            icao_code: row.icao_code,
            iata_code: row.iata_code || null,
            name: row.name || null,
            type: row.type || null,
            latitude_deg: row.latitude_deg || null,
            longitude_deg: row.longitude_deg || null,
            elevation_ft: row.elevation_ft || null,
            city_id: row.city_id || null
        });

        try {
            await airportRepo.save(airport);
        } catch (err) {
            console.error(`❌ Failed to save airport ${row.icao_code}:`, err.message);
        }
    }

    console.log("✅ Data import finished");
}

module.exports = importData;
