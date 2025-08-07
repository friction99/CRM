const {Pool} = require('pg');
require('dotenv').config();
console.log(process.env.DATABASE_URL);
const pool = new Pool({
    connectionString:process.env.DATABASE_URL
})

pool.query('SELECT NOW()',(err,res)=>{
    if(err){
        console.error('DB connection error',err.stack);
    }
    else console.log('DB connected at',res.rows[0].now);
})

module.exports = pool;