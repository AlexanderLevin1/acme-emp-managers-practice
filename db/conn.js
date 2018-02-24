const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABaSE_URL || 'postgres://localhost/acme_employee_jobs_db');

module.exports = conn;
