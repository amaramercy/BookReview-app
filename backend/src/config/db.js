const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
    dialectOptions: {}, // No SSL for local Docker
  }
);

async function initializeDatabase(retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log(`Database '${process.env.DB_NAME}' connected successfully!`);
      return sequelize;
    } catch (error) {
      console.error(`Database connection failed. Retrying in ${delay/1000}s... (${i+1}/${retries})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  console.error("❌ Could not connect to the database after multiple attempts.");
  process.exit(1);
}

module.exports = initializeDatabase;

