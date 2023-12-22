/*
 Navicat Premium Data Transfer

 Source Server         : bing6749
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : localhost:3306
 Source Schema         : school_post

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 22/12/2023 09:26:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `admin_id` int NOT NULL,
  `admin_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` date NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', '123456', '2020-02-07');
INSERT INTO `admin` VALUES (2, 'admin1', '123456', '2020-01-02');
INSERT INTO `admin` VALUES (3, 'admin2', '123456', '2022-06-22');
INSERT INTO `admin` VALUES (4, 'admin3', '123456', '2022-10-26');

-- ----------------------------
-- Table structure for admin_order
-- ----------------------------
DROP TABLE IF EXISTS `admin_order`;
CREATE TABLE `admin_order`  (
  `admin_order_id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  `send_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `appointment_time` datetime(0) NULL DEFAULT NULL,
  `create_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`admin_order_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin_order
-- ----------------------------
INSERT INTO `admin_order` VALUES (1, 1, 1, '浙江万里学院钱湖校区28幢', '2023-11-29 00:00:00', '2023-12-09 00:00:00');
INSERT INTO `admin_order` VALUES (2, 1, 2, '浙江万里学院钱湖校区28幢', '2024-01-17 22:19:28', '2023-12-04 00:00:00');
INSERT INTO `admin_order` VALUES (3, 2, 3, '浙江万里学院钱湖校区28幢', '2023-12-19 00:00:00', '2023-12-04 00:00:00');
INSERT INTO `admin_order` VALUES (4, 2, 4, '浙江万里学院钱湖校区28幢', '2024-01-06 22:19:28', '2023-12-05 00:00:00');
INSERT INTO `admin_order` VALUES (5, 3, 5, '浙江万里学院钱湖校区28幢', '2023-12-19 00:00:00', '2023-12-03 00:00:00');
INSERT INTO `admin_order` VALUES (6, 3, 6, '浙江万里学院钱湖校区28幢', '2023-12-28 22:19:28', '2023-12-06 00:00:00');
INSERT INTO `admin_order` VALUES (7, 4, 7, '浙江万里学院钱湖校区28幢', '2023-12-19 00:00:00', '2023-12-07 00:00:00');
INSERT INTO `admin_order` VALUES (8, 4, 8, '浙江万里学院钱湖校区28幢', '2023-12-25 00:00:00', '2023-12-07 00:00:00');
INSERT INTO `admin_order` VALUES (9, NULL, 3, '浙江万里学院钱湖校区28幢', '2024-01-06 22:19:28', NULL);
INSERT INTO `admin_order` VALUES (10, NULL, 3, '浙江万里学院钱湖校区28幢', '2023-12-19 15:47:50', NULL);
INSERT INTO `admin_order` VALUES (11, NULL, 3, '浙江万里学院钱湖校区28幢', '2023-12-27 22:19:28', NULL);
INSERT INTO `admin_order` VALUES (12, NULL, 4, '浙江万里学院钱湖校区28幢', '2023-12-19 19:14:12', NULL);
INSERT INTO `admin_order` VALUES (13, NULL, 4, '浙江万里学院钱湖校区28幢', '2023-12-22 19:16:53', NULL);
INSERT INTO `admin_order` VALUES (14, NULL, 4, '浙江万里学院钱湖校区28幢', '2023-11-29 19:18:18', NULL);
INSERT INTO `admin_order` VALUES (15, NULL, 4, '浙江万里学院钱湖校区28幢', '2024-01-06 22:19:28', NULL);
INSERT INTO `admin_order` VALUES (16, NULL, 4, '浙江万里学院钱湖校区28幢', '2023-12-21 22:20:08', NULL);
INSERT INTO `admin_order` VALUES (17, NULL, 3, 'Detroit, Michigan(MI)', '2023-12-21 22:57:57', NULL);

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_num` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `send_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `send_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `send_phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `send_company` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `consignee` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `consignee_phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `consignee_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `weight` double NULL DEFAULT NULL,
  `price` double NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL COMMENT '0为未寄出，1为已寄出',
  `create_time` date NULL DEFAULT NULL,
  `update_time` date NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES (1, '6754569682365', 'Yuen Wing Fat', '浙江万里学院钱湖校区28幢', '18399999999', '韵达', 'Craig Bryant', '18104452534', '白云区机场路棠苑街五巷427号', 8.32, 100, 0, '2007-04-05', '2020-10-07');
INSERT INTO `order` VALUES (2, '8307879248874', 'Yuen Wing Fat', '浙江万里学院钱湖校区28幢', '17799999999', '邮政', 'Mui Kar Yan', '18043206646', '成华区二仙桥东三路645号', 5.96, 72.73, 1, '2006-02-26', '2011-07-25');
INSERT INTO `order` VALUES (3, '3315305872260', 'To On Kay', '浙江万里学院钱湖校区28幢', '19999999999', '中通', 'Yau Sum Wing', '14684440041', '東城区東直門內大街425号', 6.38, 77.15, 0, '2014-06-17', '2018-12-28');
INSERT INTO `order` VALUES (4, '9913622984613', 'Au Tin Wing', '浙江万里学院钱湖校区28幢', '19999999999', '顺丰', 'Yoshida Rena', '16419907118', '成华区双庆路861号', 13.73, 161.87, 1, '2005-01-17', '2023-12-10');
INSERT INTO `order` VALUES (5, '2888303241694', 'Au Tin Wing', '浙江万里学院钱湖校区28幢', '18399999999', '德邦', 'Lee Ming Sze', '20743616955', '海珠区江南西路554号', 10.56, 124.79, 1, '2013-05-30', '2023-12-10');
INSERT INTO `order` VALUES (6, '3222505257636', 'Ku Wai Lam', '浙江万里学院钱湖校区28幢', '18399999999', '京东', 'Shing Ka Fai', '19531719696', '黄浦区淮海中路316号', 3.94, 33.86, 1, '2021-02-16', '2023-12-10');
INSERT INTO `order` VALUES (7, '7169069448866', 'Lai Wai San', '浙江万里学院钱湖校区28幢', '17799999999', '京东', 'Irene Hawkins', '14850359433', '坑美十五巷830号', 5.69, 60.01, 0, '2008-10-01', '2012-04-14');
INSERT INTO `order` VALUES (8, '3062309495420', 'Tsang Sze Kwan', '浙江万里学院钱湖校区28幢', '18399999999', '韵达', 'Heather Harris', '16528052268', '坑美十五巷656号', 9.8, 116.91, 0, '2020-04-18', '2023-12-10');
INSERT INTO `order` VALUES (9, '6708489946824', 'Cheung Wai Man', '浙江万里学院钱湖校区28幢', '17799999999', '顺丰', 'Koon Yun Fat', '10456511206', '东城区东单王府井东街12号', 3.75, 31.23, 0, '2010-09-26', '2023-12-10');
INSERT INTO `order` VALUES (10, '3088300728110', 'Yung Ka Man', '浙江万里学院钱湖校区28幢', '17799999999', '顺丰', 'Murata Momoe', '76919046587', '坑美十五巷662号', 7.22, 85.12, 0, '2013-06-28', '2015-10-14');
INSERT INTO `order` VALUES (11, '3888303241694', 'Lai Wai San', '浙江万里学院钱湖校区', '18399999999', 'SF', 'Rui Ma', '13678907890', '东城区东单王府井东街12号', 3, 12, NULL, '2023-12-22', NULL);
INSERT INTO `order` VALUES (12, '3888303241694', 'Lai Wai San', '浙江万里学院钱湖校区', '18399999999', 'SF', 'Rui Ma', '13678907890', '东城区东单王府井东街12号', 3, 12, NULL, '2023-12-21', NULL);

-- ----------------------------
-- Table structure for package
-- ----------------------------
DROP TABLE IF EXISTS `package`;
CREATE TABLE `package`  (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `package_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `package_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `consignee` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `consignee_phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `consignee_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` int NOT NULL COMMENT '0未取件 1已取出',
  `create_time` date NULL DEFAULT NULL,
  `update_time` date NULL DEFAULT NULL,
  PRIMARY KEY (`package_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of package
-- ----------------------------
INSERT INTO `package` VALUES (1, '93-3-4589', '菜鸟驿站1', 'Yuen Wing Fat', '19099999999', '浙江万里学院钱湖校区', 1, '2006-01-21', '2022-04-11');
INSERT INTO `package` VALUES (2, '56-2-1222', '菜鸟驿站1', 'To On Kay', '17799999999', '浙江万里学院钱湖校区', 1, '2015-10-17', '2011-03-19');
INSERT INTO `package` VALUES (3, '23-1-2254', '菜鸟驿站1', 'To On Kay', '17799999999', '浙江万里学院钱湖校区', 1, '2020-12-29', '2002-04-28');
INSERT INTO `package` VALUES (4, '45-1-9887', '菜鸟驿站1', 'Au Tin Wing', '17799999999', '浙江万里学院钱湖校区', 0, '2018-06-27', '2007-02-11');
INSERT INTO `package` VALUES (5, '500-4-6021', '菜鸟驿站3', 'Ku Wai Lam', '18399999999', '浙江万里学院钱湖校区', 0, '2001-09-03', '2017-01-21');
INSERT INTO `package` VALUES (6, '11-1-5542', '菜鸟驿站1', 'Lai Wai San', '19099999999', '浙江万里学院钱湖校区', 0, '2006-08-15', '2010-08-14');
INSERT INTO `package` VALUES (7, '46-4-5645', '菜鸟驿站1', 'Tsang Sze Kwan', '19099999999', '浙江万里学院钱湖校区', 0, '2010-06-12', '2020-01-08');
INSERT INTO `package` VALUES (8, '102-4-3321', '菜鸟驿站2', 'Cheung Wai Man', '17799999999', '浙江万里学院钱湖校区', 1, '2007-01-18', '2016-02-11');
INSERT INTO `package` VALUES (9, '122-4-2683', '菜鸟驿站2', 'Yung Ka Man', '18399999999', '浙江万里学院钱湖校区', 0, '2013-03-28', '2013-11-07');
INSERT INTO `package` VALUES (10, '40-2-5130', '菜鸟驿站1', 'Yung Ka Man', '13799999999', '浙江万里学院钱湖校区', 0, '2013-02-22', '2023-11-13');
INSERT INTO `package` VALUES (11, '12-3-4444', 'Edward King 0', '32', '17777777777', '浙江万里学院钱湖校区', 0, '2023-12-20', NULL);
INSERT INTO `package` VALUES (12, '12-3-4444', '菜鸟驿站1', '马睿', '17777777777', '浙江万里学院钱湖校区', 0, '2023-12-21', NULL);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int NOT NULL,
  `user_phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` date NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '13799999999', '2023-11-21');
INSERT INTO `user` VALUES (2, '13799999999', '2023-10-09');
INSERT INTO `user` VALUES (3, '18399999999', '2023-10-10');
INSERT INTO `user` VALUES (4, '17799999999', '2023-06-11');
INSERT INTO `user` VALUES (5, '19099999999', '2023-05-17');
INSERT INTO `user` VALUES (6, '13799999999', '2020-06-18');
INSERT INTO `user` VALUES (7, '13799999999', '2019-02-13');
INSERT INTO `user` VALUES (8, '13799999999', '2014-06-26');

SET FOREIGN_KEY_CHECKS = 1;
