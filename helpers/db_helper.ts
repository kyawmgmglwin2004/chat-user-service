import mysql from "mysql2";
import config from "../configurations/config";

const pool = mysql.createPool({
  connectionLimit: 200,
  waitForConnections: true,
  host: config.DB_HOST || "localhost",
  port: Number(config.DB_PORT) || 3306,
  user: config.DB_USER || "root",
  password:  "",
  database: config.DB_NAME || "chat",
  debug: false,
  dateStrings: true,
});

// Test connection at startup
pool.getConnection((err, connection) => {
  if (err) {
    switch (err.code) {
      case "PROTOCOL_CONNECTION_LOST":
        console.error("❌ Database connection was closed.");
        break;
      case "ER_CON_COUNT_ERROR":
        console.error("❌ Database has too many connections.");
        break;
      case "ECONNREFUSED":
        console.error("❌ Database connection was refused.");
        break;
      case "ER_ACCESS_DENIED_ERROR":
        console.error("❌ Invalid DB credentials. Check DB_USER/DB_PASSWORD.");
        break;
      default:
        console.error("❌ Database error:", err.message);
    }
    process.exit(1); // stop app if DB is not reachable
  }

  if (connection) connection.release();
  console.log("✅ Database connection established.");
});

export default pool.promise();
