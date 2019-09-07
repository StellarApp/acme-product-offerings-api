// const pg = require('pg');
const Sequelize = require("sequelize");
const { UUID, UUIDV4, STRING, DECIMAL, Model } = Sequelize;
const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_db"
);

sequelize
  .authenticate()
  .then(() => {
    console.log("sequelizeected!");
  })
  .catch(err => {
    console.error("Unable to sequelizeect database", err);
  });

const idDef = {
  type: UUID,
  primaryKey: true,
  defaultValue: UUIDV4
};

const nameDef = {
  type: STRING,
  unique: true,
  allowNull: false
};

const foreignKeyDef = {
  type: UUID,
  allowNull: false
};

const foreignKeyDef2 = {
  type: UUID,
  allowNull: false
};

class Product extends Model {}
class Company extends Model {}
class Offering extends Model {}

Product.init(
  {
    id: idDef,
    name: nameDef,
    suggestedPrice: DECIMAL,
    companyId: foreignKeyDef
  },
  { sequelize, modelName: "product" }
);

Company.init(
  {
    id: idDef,
    name: nameDef
  },
  { sequelize, modelName: "company" }
);

Offering.init(
  {
    id: idDef,
    price: DECIMAL,
    productId: foreignKeyDef2,
    companyId: foreignKeyDef
  },
  { sequelize, modelName: "offering" }
);

Product.belongsTo(Company);
Company.hasMany(Product);

Offering.belongsTo(Company);
Company.hasMany(Offering);

Offering.belongsTo(Product);
Product.hasMany(Offering);

const sync = async () => {
  await sequelize.sync({ force: true });
};

module.export = {
  sync,
  models: {
    Product,
    Company,
    Offering
  }
};
