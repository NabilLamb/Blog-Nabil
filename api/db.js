import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
    host: dotenv.DB_HOST || "localhost",
    user: dotenv.DB_USER || "root",
    password: dotenv.DB_PASSWORD || "",
    database: dotenv.DB_NAME || "blog",
});