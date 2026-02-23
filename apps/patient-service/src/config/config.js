// import dotenv from 'dotenv';
// dotenv.config();
export default {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'clinic_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
};
