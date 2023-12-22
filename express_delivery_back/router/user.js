// const express = require('express')
// const mysql = require("mysql");
// // 创建路由对象
// // const router = express.Router()
// const db = mysql.createConnection({
//     host:'localhost',
//     user: 'root',
//     password: '123456',
//     database:'school_post',
//     port: '3306'
// })
// // 登录
// const router = (req,res)=>{
//     db.query('select * from user',(err,results)=>{
//
//         if (err){
//             res.send(results)
//             console.log(results)
//         }
//         else{
//             res.send(results)
//         }
//     })
// }
// // 将路由对象共享出去
// module.exports = router
