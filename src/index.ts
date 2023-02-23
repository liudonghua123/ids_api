import * as dotenv from 'dotenv';
import debug from 'debug';
import { signData, generateRandomString, encrypt, doPost, removeEmptyValues, Attributes, AttributesCreate, POST_PARAMS } from './utlities';

dotenv.config();
const log = debug('app:log');

const { BASE_URL, APP_ID, APP_SECRET } = process.env;
if (!BASE_URL || !APP_ID || !APP_SECRET) throw new Error('Missing BASE_URL, APP_ID or APP_SECRET in .env file');
const base_url = BASE_URL as string;
const app_id = APP_ID as string;
const app_secret = APP_SECRET as string;

log(`[app] base_url: ${base_url}, app_id: ${app_id}, app_secret: ${app_secret}`);

/**
 * 
 * @param uid 
 * @returns 
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
 * 
 * @param attributes 
 * @returns 
 */
export async function saveUser(attributes: AttributesCreate) {
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
 * 
 * @param uid 
 * @param attributes 
 * @returns 
 */
export async function updateAttributes(uid: string, attributes: Attributes) {
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
 * 
 * @param uid 
 * @param oldValue 
 * @param newValue 
 * @returns 
 */
export async function updatePassword(uid: string, oldValue: string, newValue: string) {
  const timeStamp = `${new Date().getTime()}`;
  const randomStr = generateRandomString();
  const encryptedOldValue = encrypt(app_secret, oldValue as string, randomStr);
  const encryptedNewValue = encrypt(app_secret, newValue as string, randomStr);
  const sign = signData(app_secret, timeStamp, randomStr, `${uid}${encryptedOldValue}${encryptedNewValue}`);
  log(`[updatePassword] sign: ${sign}`);
  const params = {
    uid,
    oldValue: encryptedOldValue,
    newValue: encryptedNewValue,
    timeStamp,
    randomStr,
    sign,
  };
  const result = await doPost(`${base_url}/authserver/restApi/internal/user/updatePassword`, params, app_id, app_secret);
  log(`[updatePassword] result: ${JSON.stringify(result)}`);
  return result;
}
