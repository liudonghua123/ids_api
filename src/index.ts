import * as dotenv from 'dotenv';
import debug from 'debug';
import { signData, generateRandomString, encrypt, doPost, removeEmptyValues } from './utlities';
import { ATTRIBUTES_CREATE, POST_PARAMS, ATTRIBUTES, POST_PARAMS_MESSAGE, POST_PARAMS_BINDINGUSER, POST_PARAMS_UIDSWITCH } from './types';

dotenv.config();
const log = debug('app:log');

const { BASE_URL, APP_ID, APP_SECRET } = process.env;
if (!BASE_URL || !APP_ID || !APP_SECRET) throw new Error('Missing BASE_URL, APP_ID or APP_SECRET in .env file');

const base_url = BASE_URL as string;
const app_id = APP_ID as string;
const app_secret = APP_SECRET as string;

log(`[app] base_url: ${base_url}, app_id: ${app_id}, app_secret: ${app_secret}`);

/**
 * 获取用户属性信息
 * @param uid 用户ID
 * @returns 用户属性信息
 */
export async function getAttributes(uid: string) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const sign = signData(app_secret, timeStamp, randomStr, uid);
  log(`[getAttributes] sign: ${sign}`);
  const params = {
    uid,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/user/getAttributes`, params, app_id, app_secret);
  log(`[getAttributes] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 添加用户
 * @param attributes 用户属性信息
 * @returns 
 */
export async function saveUser(attributes: ATTRIBUTES_CREATE) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const { password } = attributes;
  if (!password) throw new Error('Missing password in attributes');
  const encryptedPassword = encrypt(app_secret, password as string, randomStr);
  log(`[saveUser] password: ${password}, encryptedPassword: ${encryptedPassword}`);
  // overwrite password with encrypted password
  attributes.password = encryptedPassword;
  let data: object | string = removeEmptyValues(attributes);
  data = JSON.stringify(data);
  log(`[updateAttributes] attributes: ${JSON.stringify(attributes)}, data: ${data}`);
  const sign = signData(app_secret, timeStamp, randomStr, data);
  log(`[saveUser] sign: ${sign}`);
  const params: POST_PARAMS = {
    data,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/user/saveUser`, params, app_id, app_secret);
  log(`[saveUser] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 修改用户
 * @param uid 用户ID
 * @param attributes 用户属性信息
 * @returns 
 */
export async function updateAttributes(uid: string, attributes: ATTRIBUTES) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  let data: object | string = removeEmptyValues(attributes);
  log(`[updateAttributes] attributes: ${JSON.stringify(attributes)}, data: ${JSON.stringify(data)}`);
  data = JSON.stringify(data);
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}${data}`);
  log(`[updateAttributes] sign: ${sign}`);
  const params: POST_PARAMS = {
    uid,
    data,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/user/updateAttributes`, params, app_id, app_secret);
  log(`[updateAttributes] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 用户修改密码
 * @param uid 用户ID
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 
 */
export async function updatePassword(uid: string, oldPassword: string, newPassword: string) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const encryptedOldPassword = encrypt(app_secret, oldPassword as string, randomStr);
  const encryptedNewPassword = encrypt(app_secret, newPassword as string, randomStr);
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}${encryptedOldPassword}${encryptedNewPassword}`);
  log(`[updatePassword] sign: ${sign}`);
  const params = {
    uid,
    oldValue: encryptedOldPassword,
    newValue: encryptedNewPassword,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/user/updatePassword`, params, app_id, app_secret);
  log(`[updatePassword] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 管理员修改密码
 * @param uid 用户ID
 * @param password 密码
 * @returns 
 */
export async function updateManagerPassword(uid: string, password: string) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const encryptePassword = encrypt(app_secret, password as string, randomStr);
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}${encryptePassword}`);
  log(`[updateManagerPassword] sign: ${sign}`);
  const params = {
    uid,
    password: encryptePassword,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/manager/updatePassword`, params, app_id, app_secret);
  log(`[updateManagerPassword] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 编辑用户组
 * @param uid 用户ID
 * @param memberOf 用户组列表
 * @returns 
 */
export async function addUserToGroup(uid: string, memberOf: [string]) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const data = JSON.stringify({memberOf});
  log(`[addUserToGroup] data: ${data}`);
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}${data}`);
  log(`[addUserToGroup] sign: ${sign}`);
  const params: POST_PARAMS = {
    uid,
    data,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/group/addUserToGroup`, params, app_id, app_secret);
  log(`[addUserToGroup] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 编辑用户组
 * @param uid 用户ID
 * @param memberOf 用户组列表
 * @returns 
 */
export async function removeUserOfGroup(uid: string, memberOf: [string]) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const data = JSON.stringify({memberOf});
  log(`[removeUserOfGroup] data: ${data}`);
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}${data}`);
  log(`[removeUserOfGroup] sign: ${sign}`);
  const params: POST_PARAMS = {
    uid,
    data,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/group/removeUserOfGroup`, params, app_id, app_secret);
  log(`[removeUserOfGroup] result: ${JSON.stringify(result)}`);
  return result;
}


/**
 * 消息推送
 * @param uid 用户ID
 * @param title 消息标题（邮箱）
 * @param msgContent 消息内容
 * @returns 
 */
export async function sendMessage(uid: string, title: string, msgContent: string) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const encryptedTitle = encrypt(app_secret, title, randomStr);
  const encryptedMsgContent = encrypt(app_secret, msgContent, randomStr);
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}`);
  log(`[sendMessage] sign: ${sign}`);
  const params: POST_PARAMS_MESSAGE = {
    uid,
    title: encryptedTitle,
    msgContent: encryptedMsgContent,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/manager/sendMessage`, params, app_id, app_secret);
  log(`[sendMessage] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 身份绑定
 * @param uid 用户ID
 * @param defaultUid 默认账户ID
 * @returns 
 */
export async function setBindingUserDefault(uid: string, defaultUid: string) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}`);
  log(`[setBindingUserDefault] sign: ${sign}`);
  const params: POST_PARAMS_BINDINGUSER = {
    uid,
    defaultUid,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/identity/setBindingUserDefault`, params, app_id, app_secret);
  log(`[setBindingUserDefault] result: ${JSON.stringify(result)}`);
  return result;
}

/**
 * 身份切换接口
 * @param uid 用户ID
 * @param defaultUserNO 默认别名
 * @returns 
 */
export async function setUidSwitchDefault(uid: string, defaultUserNO: string) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}`);
  log(`[setUidSwitchDefault] sign: ${sign}`);
  const params: POST_PARAMS_UIDSWITCH = {
    uid,
    defaultUserNO,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/identity/setUidSwitchDefault`, params, app_id, app_secret);
  log(`[setUidSwitchDefault] result: ${JSON.stringify(result)}`);
  return result;
}