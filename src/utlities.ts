import axios from 'axios';
import crypto, { createCipheriv, randomBytes } from 'crypto';
import debug from 'debug';
import { COMMON_RESPONSE } from './types';
const log = debug('utlities:log');

/**
 * 使用sha1签名数据
 * @param accessToken 
 * @param timeStamp 
 * @param randomString 
 * @param data 
 * @returns 
 */
export function signData(accessToken: string, timeStamp: string, randomString: string, data: string): string {
    const encrypt_data = [accessToken, timeStamp, randomString, data].sort().join('');
    const hash = crypto.createHash('sha1');
    hash.update(encrypt_data);
    return hash.digest('hex');
}

/**
 * 加密
 * The implementation is inspired by @wecom/crypto, but use aes-128-cbc instead of aes-256-cbc
 *
 * @param key            key
 * @param message        消息文本
 * @param id             ID
 * @param random         随机串
 */
export function encrypt(key: string, message: string, random: string | Buffer = randomBytes(16)) {
    const iv = Buffer.from(`${key}=`, 'base64').subarray(0, 16);
    const msg = Buffer.from(message);
    const msgLength = Buffer.allocUnsafe(4);
    msgLength.writeUInt32BE(msg.length, 0);
    const data = Buffer.concat([
        Buffer.from(random),
        msgLength,
        msg,
    ]);
    const cipher = createCipheriv('aes-128-cbc', key, iv);
    const ciphered = Buffer.concat([
        cipher.update(data),
        cipher.final(),
    ]);
    return ciphered.toString('base64');
}

/**
 * 
 * @param length 
 * @returns 
 */
export function generateRandomString(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function removeEmptyValues(obj: any) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => !(value === null || value == undefined)));
}

/**
 * 
 * @param url 
 * @param params 
 * @param appId 
 * @param accessToken 
 * @returns 
 */
export async function doPost(url: string, params: object, appId: string, accessToken: string): Promise<COMMON_RESPONSE> {
    // https://axios-http.com/docs/urlencoded#automatic-serialization
    // Axios will automatically serialize the data object to urlencoded format if the content-type header is set to application/x-www-form-urlencoded
    const response = await axios.post(url, params, {
        headers: {
            appId,
            accessToken,
            'content-type': 'application/x-www-form-urlencoded',
        }
    });
    if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
    }
    const responseData = response.data as COMMON_RESPONSE;
    log(`[utilities] response.data: ${JSON.stringify(response.data)}`);
    if (responseData.status !== '1') {
        log(`API maybe return some errors: ${JSON.stringify(responseData)}`);
    }
    return responseData;
}