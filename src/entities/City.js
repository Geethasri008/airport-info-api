const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "City",
  tableName: "city",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", nullable: false },
    country_id: { type: "int", nullable: true },
    is_active: { type: "boolean", default: true },
    lat: { type: "float", nullable: true },
    long: { type: "float", nullable: true }
  },
  relations: {
    country: { 
      type: "many-to-one", 
      target: "Country", 
      joinColumn: { name: "country_id" },
      nullable: true
    },
    airports: { 
      type: "one-to-many", 
      target: "Airport", 
      inverseSide: "city" 
    }
  }
});
