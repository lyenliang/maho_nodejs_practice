'use strict'

/*
第1位表示收發方向
client -> server: 1
server -> client: 2

第2-3 位
00: LOGIN
01: UPDATE_SCORE
02: UPDATE_MATERIAL_NUMBER

第4-6 位
999: ERROR
 */

exports.C_LOGIN_REQUEST = 100000;

exports.S_LOGIN_OLD_PLAYER_RESPONSE = 200001;

exports.S_LOGIN_NEW_PLAYER_RESPONSE = 200002;

exports.S_LOGIN_ERROR = 200999;


exports.C_UPDATE_SCORE_REQUEST = 10100;

exports.S_UPDATE_SCORE_RESPONSE = 201001;

exports.S_UPDATE_SCORE_ERROR = 201999;


exports.C_UPDATE_MATERIAL_NUMBER_REQUEST = 102000;

exports.S_UPDATE_MATERIAL_NUMBER_RESPONSE = 202001;

exports.S_UPDATE_MATERIAL_NUMBER_ERROR = 202999;