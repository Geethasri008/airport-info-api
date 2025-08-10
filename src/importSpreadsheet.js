const xlsx = require("xlsx");
const { AppDataSource } = require("./data-source");
const Airport = require("./entities/Airport");

async function importData() {
    const workbook = xlsx.readFile("C:/Users/geeth/Downloads/Database.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    await AppDataSource.initialize();
    const airportRepo = AppDataSource.getRepository(Airport);

    for (const row of rows) {
        // Make sure these match the headers in Database.xlsx
        if (!row.icao_code) {
            console.warn(`Skipping row: ICAO code missing`);
            continue;
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

        await airportRepo.save(airport);
    }

    console.log("✅ Data imported successfully");
    await AppDataSource.destroy();
}

importData();
