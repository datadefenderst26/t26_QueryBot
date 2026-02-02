import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'lshortline.proxy.rlwy.net',
  user: 'root',
  password: 'fJzOwwhhtGkzZxNPtIpyQaComwRFUGSQ',
  database: 'railway',
  port: 3306,          
  ssl: { rejectUnauthorized: false }
});

export default db;
