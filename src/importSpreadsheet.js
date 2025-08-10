const path = require("path");
const xlsx = require("xlsx");
const { AppDataSource } = require("./data-source");
const Airport = require("./entities/Airport");

async function importData() {
    const filePath = path.join(__dirname, "Database.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const airportRepo = AppDataSource.getRepository(Airport);

    for (const row of rows) {
        if (!row.icao_code) {
            console.warn(`Skipping row: ICAO code missing`);
            continue;
        }

        let cityId = row.city_id || null;

        // Try checking if the city exists, if not set null
        if (cityId) {
            const cityExists = await AppDataSource.query(
                "SELECT id FROM city WHERE id = ?",
                [cityId]
            );
            if (cityExists.length === 0) {
                console.warn(`City ID ${cityId} not found. Setting to null.`);
                cityId = null;
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
            city_id: cityId
        });

        await airportRepo.save(airport);
    }

    console.log("✅ Data imported successfully");
}

module.exports = importData;
