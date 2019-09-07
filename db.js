// const pg = require('pg');
const faker = require('faker')
const Sequelize = require("sequelize");
const { UUID, UUIDV4, STRING, DECIMAL, Model } = Sequelize;
const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_db"
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Sequelizeected!");
  })
  .catch(err => {
    console.error("Unable to connect to database:", err);
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

class Product extends Model { }
Product.init(
  {
    id: idDef,
    name: nameDef,
    suggestedPrice: DECIMAL,
    companyId: {
      type: UUID,
      allowNull: false
    }
  },
  { sequelize, modelName: "product" }
);

class Company extends Model { }
Company.init(
  {
    id: idDef,
    name: nameDef
  },
  { sequelize, modelName: "company" }
);

class Offering extends Model { }
Offering.init(
  {
    id: idDef,
    price: DECIMAL,
    productId: {
      type: UUID,
      allowNull: false
    },
    companyId: {
      type: UUID,
      allowNull: false
    }
  },
  { sequelize, modelName: "offering" }
);

Product.belongsTo(Company);
Company.hasMany(Product);

Offering.belongsTo(Company);
Company.hasMany(Offering);

Offering.belongsTo(Product);
Product.hasMany(Offering);

const modelMapper = (model, data) => data.map(item => model.create(item))

const sync = async () => {
  await sequelize.sync({ force: true });
  const companies = (new Array(5)).fill('').map(() => { return { name: faker.company.companyName() } })
  const companyInstances = await Promise.all(modelMapper(Company, companies))
  const products = (new Array(5)).fill('').map((item, idx) => { return { name: faker.commerce.productName(), suggestedPrice: faker.commerce.price(), companyId: companyInstances[idx].id } })
  const productInstances = await Promise.all(modelMapper(Product, products))
  const offerings = (new Array(5)).fill('').map((item, idx) => { return { price: faker.commerce.price(), companyId: companyInstances[idx].id, productId: productInstances[idx].id } })
  await Promise.all(modelMapper(Offering, offerings))
};

module.exports = {
  sync,
  models: {
    Product,
    Company,
    Offering
  }
};

