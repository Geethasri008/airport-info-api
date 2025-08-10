const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Airport",
  tableName: "airport",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    icao_code: {
      type: "varchar",
      nullable: false,
    },
    iata_code: {
      type: "varchar",
      nullable: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    type: {
      type: "varchar",
      nullable: true,
    },
    latitude_deg: {
      type: "real",
      nullable: true,
    },
    longitude_deg: {
      type: "real",
      nullable: true,
    },
    elevation_ft: {
      type: "int",
      nullable: true,
    },
    city_id: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    city: {
      type: "many-to-one",
      target: "City",
      joinColumn: { name: "city_id" },
      nullable: true,
    },
  },
});
