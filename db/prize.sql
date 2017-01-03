/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : lottery

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2016-01-13 18:59:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for prize
-- ----------------------------
DROP TABLE IF EXISTS `prize`;
CREATE TABLE `prize` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT '主键Id',
  `name` varchar(50) DEFAULT NULL COMMENT '奖项名称',
  `cnname` varchar(50) DEFAULT NULL COMMENT '中文名',
  `num` smallint(6) DEFAULT NULL COMMENT '奖品个数',
  `level` smallint(6) DEFAULT NULL COMMENT '奖项级别',
  `type` smallint(6) DEFAULT '1' COMMENT '奖项类别（阳光普照是0，其余是1）',
  `index` smallint(6) DEFAULT NULL COMMENT '排序',
  `prelimit` smallint(6) DEFAULT NULL COMMENT '间隔多少抽',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of prize
-- ----------------------------
INSERT INTO `prize` VALUES ('1', 'macbook', '12 英寸 MacBook', '5', '0', '1', '1', '1');
INSERT INTO `prize` VALUES ('2', 'iphone6s', '苹果6S(64g)', '10', '1', '1', '2', '10');
INSERT INTO `prize` VALUES ('3', 'GoPro4', 'GoPro4运动摄像机', '15', '2', '1', '3', '15');
INSERT INTO `prize` VALUES ('4', 'iwatch', '苹果手表', '20', '3', '1', '4', '20');
INSERT INTO `prize` VALUES ('5', 'Ninebot', '小米平衡车', '25', '4', '1', '5', '25');
INSERT INTO `prize` VALUES ('6', 'purifier', '小米空气净化器2代', '35', '5', '1', '6', '35');
INSERT INTO `prize` VALUES ('7', 'shoppingcard', '全国通用购物卡', '50', '6', '1', '7', '25');
INSERT INTO `prize` VALUES ('8', 'sphygmomanometer', '血压计', '100', '7', '1', '8', '50');
INSERT INTO `prize` VALUES ('9', 'Scales', '小米智能体重秤', '150', '8', '1', '9', '50');
INSERT INTO `prize` VALUES ('10', 'doll', '购物卡或公仔', '175', '9', '0', '10', '90');
