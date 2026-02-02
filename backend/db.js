import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'shortline.proxy.rlwy.net',
  user: 'root',
  password: 'fJzOwwhhtGkzZxNPtIpyQaComwRFUGSQ',
  database: 'railway',
  port: 13262,          
  ssl: { rejectUnauthorized: false }
});

export default db;
