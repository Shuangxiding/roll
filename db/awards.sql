/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : lottery

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2016-01-13 19:00:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for awards
-- ----------------------------
DROP TABLE IF EXISTS `awards`;
CREATE TABLE `awards` (
  `rtx` varchar(50) NOT NULL,
  `priid` smallint(6) DEFAULT NULL COMMENT '奖品Id',
  `priname` varchar(50) DEFAULT NULL,
  `havetime` datetime DEFAULT NULL,
  `pritype` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`rtx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of awards
-- ----------------------------
