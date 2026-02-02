import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'lshortline.proxy.rlwy.net',
  user: 'root',
  password: 'fJzOwwhhtGkzZxNPtIpyQaComwRFUGSQ',
  database: 'railway'
});
