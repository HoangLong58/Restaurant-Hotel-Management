const mysql = require("mysql");
const dotenv = require("dotenv");

// Dùng thư viện dotenv để che giấu một số dữ liệu quan trọng
dotenv.config();

// Kết nối database MySQL
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;