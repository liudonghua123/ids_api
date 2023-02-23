import axios from 'axios';
import crypto, { createCipheriv, randomBytes } from 'crypto';
import debug from 'debug';
const log = debug('utlities:log');

/**
 * 
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

export interface Attributes {
    uid?: string | null | undefined,
    cn?: string | null | undefined,
    container?: string | null | undefined,
    status?: 'Active' | 'Inactive',
    password?: string | null | undefined,
    pwdPolicy?: 1 | 2 | 3,
    memberOf?: [string] | null | undefined,
    alias?: [string] | null | undefined,
    mail?: string | null | undefined,
    telephoneNumber?: string | null | undefined,
}

export interface AttributesCreate {
    uid: string,
    cn: string,
    /**
     * container name
     * common container name: 
     * 本科生：'ou=bk,ou=student,ou=People' 
     * 研究生：'ou=yjs,ou=student,ou=People'
     * 教职工：'ou=jzg,ou=People'
     * 附属：'ou=affiliate,ou=People'
     * 校友：'ou=alumnus,ou=People'
     * 外聘：'ou=external,ou=People'
     */
    container: string,
    status: 'Active' | 'Inactive',
    password: string,
    pwdPolicy: 1 | 2 | 3,
    /**
     * group name
     * common group name:
     * 教职工：'10'
     * 离校学生：'lxxs'
     * 校友：'alumnus'
     * 本科生：'bk'
     */
    memberOf: [string],
    alias?: [string] | null | undefined,
    mail?: string | null | undefined,
    telephoneNumber?: string | null | undefined,
}

export interface POST_PARAMS {
    uid?: string | null | undefined,
    data: string,
    timeStamp: string,
    randomStr: string,
    sign: string,
}

/**
 * 
 * @param url 
 * @param params 
 * @param appId 
 * @param accessToken 
 * @returns 
 */
export async function doPost(url: string, params: object, appId: string, accessToken: string): Promise<any> {
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
    const responseData = response.data as { status: string, data: any };
    log(`[utilities] response.data: ${JSON.stringify(response.data)}`);
    if (responseData.status !== '1') {
        throw new Error(`API return errors: ${JSON.stringify(responseData)}`);
    }
    return responseData.data;
}

/**
 * 加密
 *
 * @param encodingAESKey EncodingAESKey
 * @param message        消息文本
 * @param id             ID
 * @param random         随机串
 */
export function encrypt(encodingAESKey: string, message: string, random: string | Buffer = randomBytes(16)) {
    const { key, iv } = parseEncodingAESKey(encodingAESKey);
    const msg = Buffer.from(message);
    const msgLength = Buffer.allocUnsafe(4);
    msgLength.writeUInt32BE(msg.length, 0);
    const data = Buffer.concat([
        Buffer.from(random),
        msgLength,
        msg,
    ]);
    const deciphered = pkcs7Pad(data);
    const cipher = createCipheriv('aes-128-cbc', key, iv);
    // cipher.setAutoPadding(false);
    const ciphered = Buffer.concat([
        cipher.update(data),
        cipher.final(),
    ]);
    return ciphered.toString('base64');
}

// The following code if from @wecom/crypto and is not exported

/**
 * 解码并校验 encodingAESKey
 *
 * @param encodingAESKey EncodingAESKey
 */
function parseEncodingAESKey(encodingAESKey: string) {
    const key = Buffer.from(`${encodingAESKey}=`, 'base64');
    log(`key: ${key}, key.length: ${key.length}`);
    /* istanbul ignore if */
    if (key.length !== 16) {
        throw new Error('invalid encodingAESKey');
    }
    const iv = key.subarray(0, 16);
    return { key, iv };
}

/**
 * @param data
 */
function pkcs7Pad(data: Uint8Array) {
    const padLength = 32 - (data.length % 32);
    const result = Buffer.allocUnsafe(padLength);
    result.fill(padLength);
    return Buffer.concat([data, result]);
}

/**
 * @param data
 */
function pkcs7Unpad(data: Uint8Array) {
    const padLength = data[data.length - 1];
    /* istanbul ignore if */
    if (padLength < 1 || padLength > 32) {
        return data;
    }
    return data.slice(0, data.length - padLength);
}