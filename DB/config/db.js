import pg from "pg";
import dotenv from "dotenv";

import { EnrollmentModel } from '../models/enrollmentModel.js';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
 
});

pool.connect().then(() => {
  console.log("Database connected!");
});
export const query = (text, params) => pool.query(text, params);

const enrollmentModel = new EnrollmentModel(query);


export default pool;
