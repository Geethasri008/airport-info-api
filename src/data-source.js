const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "airport.db",
    synchronize: true,
    entities: [__dirname + "/entities/*.js"],
});

module.exports = { AppDataSource };
