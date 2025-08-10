const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Country",
  tableName: "country",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", nullable: false },
    country_code_two: { type: "varchar", nullable: true },
    country_code_three: { type: "varchar", nullable: true },
    mobile_code: { type: "int", nullable: true },
    continent_id: { type: "int", nullable: true }
  },
  relations: {
    cities: {
      type: "one-to-many",
      target: "City",
      inverseSide: "country"
    }
  }
});
