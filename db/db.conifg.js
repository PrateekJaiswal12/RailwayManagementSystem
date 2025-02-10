import mysql from 'mysql2';
import { configDotenv } from 'dotenv';

configDotenv();

const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((error, connection) => {
    if(error) {
        console.error('Databases connection failed: ', error.message);
    }   else{
        console.log('Database connected successfully');
        connection.release()
    }
});


export default pool;