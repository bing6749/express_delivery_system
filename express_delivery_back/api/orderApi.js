const models = require('../db/db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../db/sqlMap');
const dayjs = require("dayjs");


const conn = mysql.createConnection(models.mysql);
conn.connect();


//查找订单
router.post('/findOrder', (req, res) => {
    const params = req.body;
    console.log(params.count)
    let sel_sql = $sql.order.select;
    let count = params.count;
    switch (count) {
        case 'All':
            sel_sql += " where 1=1 ";
            break;
        case 'Daily':
            sel_sql += " where date(create_time) = date(now()) ";
            break;
        case 'Weekly':
            sel_sql += " where date(create_time) >= date(now()) - interval 7 day ";
            break;
        case 'Monthly':
            sel_sql += " where date(create_time) >= date(now()) - interval 1 month ";
            break;
        case 'Quarterly':
            sel_sql += " where date(create_time) >= date(now()) - interval 3 month ";
            break;
        case 'Yearly':
            sel_sql += " where date(create_time) >= date(now()) - interval 1 year ";
            break;
    }
    console.log(params.count)
    conn.query(sel_sql, (err, results) => {
        if (err) {
            console.log(err)
            res.send(results)
        } else {
            res.send(results)
        }
    })
});
//查找订单
router.post('/addOrder', (req, res) => {
    const params = req.body;
    const sel_sql = $sql.order.add;
    console.log(params)
    conn.query(sel_sql, [params.order_num, params.send_name, params.send_address, params.send_phone, params.send_company, params.consignee, params.consignee_phone, params.consignee_address, params.weight, params.price, dayjs().format('YYYY-MM-DD HH:mm:ss')], (err, results) => {
        if (err) {
            console.log(err)
            res.send(results)
        } else {
            res.send(results)
        }
    })
});
module.exports = router;