import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';
export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,

    pool: {
      max: 10, //max open connection
      min: 2, //minimum idle conncetion
      acquire: 30000, //max time to try getting connection
      idle: 10000, //max time connection can be idle
    },
  }
);
