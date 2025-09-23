import mysql from "mysql2"

import config from "../configurations/config";

const pool = mysql.createPool({
    connectionLimit: 200, //important
    waitForConnections: true,
    host: config.DB_HOST,
    port: Number(config.DB_PORT),
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    debug: false,
    dateStrings: true
});

// Ping database to check for common exception errors.
pool.getConnection((err : any, connection : any) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) connection.release();

    return;
})

export default pool.promise();