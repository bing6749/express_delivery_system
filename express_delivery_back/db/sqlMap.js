const sqlMap = {
  user: {
    add: 'insert into user (username, email, password) values (?,?,?)',
    select: 'select * from user',
    selectUserIdByUserPhone: 'select user_id from user where user_phone = ?',
    addUserByPhone: 'insert into user (user_phone, create_time) values (?, ?) ON DUPLICATE KEY UPDATE create_time = VALUES(create_time)',
  },
  package: {
    select: 'select * from package',
    sign: 'update package set status = 1, update_time = NOW() where status = 0',
    add: 'insert into package (package_code, package_address, consignee, consignee_phone, consignee_address, status, create_time) values (?, ?, ?, ?, ?, ?, ?)',
  },
  adminOrder: {
    add: 'insert into admin_order (user_id, send_address, appointment_time) values (?,?,?)',
    select: 'SELECT * FROM `admin_order`',
  },
  admin: {
    select: 'select * from admin',
    register: 'insert into admin (admin_name, password, create_time) values (?, ?, ?)',
  },
  order: {
    select: 'select * from `order`',
    add: 'insert into `order` (order_num, send_name, send_address,send_phone,send_company,consignee,consignee_phone,consignee_address,weight,price,create_time) values (?,?,?,?,?,?,?,?,?,?,?)',
    addDeliveryOrder: 'INSERT INTO delivery_order (package_id, user_phone, delivery_address, status, create_time) VALUES (?, ?, ?, 0, NOW())',
    getDeliveryOrders: 'SELECT d.*, p.package_code FROM delivery_order d LEFT JOIN package p ON d.package_id = p.package_id WHERE d.user_phone = ?',
  },
}

module.exports = sqlMap
