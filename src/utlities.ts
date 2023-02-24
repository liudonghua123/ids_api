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

export interface COMMON_ATTRIBUTES {
    uid?: string, // 用户编码
    sn?: string, // 姓氏
    cn?: string, // 姓名
    password?: string, // 密码
    alias?: string, // 别名
    publicKey?: string, // 公钥
    pwdProtectQuestion?: string, // 密码保护问题
    pwdProtectAnswer?: string, // 密码保护答案
    birthday?: string, // 生日
    securityEmail?: string, // 密码找回邮箱
    gender?: string, // 性别
    qq?: string, // QQ号
    homePage?: string, // 个人主页
    signature?: string, // 个人签名
    privacyProtect?: string, // 是否公开
    /**
     * group name
     * common group name:
     * 教职工：'10'
     * 离校学生：'lxxs'
     * 校友：'alumnus'
     * 本科生：'bk'
     */
    memberOf?: [string], // 成员组
    lifeTime?: string, // 过期时间
    status?: string, // 帐号状态
    eduPersonStudentID?: string, // 学号
    eduPersonStaffID?: string, // 工号
    eduPersonCardID?: string, // 证件号
    eduPersonMajor?: string, // 专业
    eduPersonStreet?: string, // 地址
    eduPersonOrgDN?: string, // 所属单位
    pwdPolicy?: 1 | 2 | 3, // 密码策略
    addFrom?: string, // 用户来源
    telephoneNumber?: string, // 电话号码
    isPhoneValidated?: string, // 手机是否验证
    isEmailValidated?: string, // 邮箱是否验证
    md4Password?: string, // 无线认证md4密码
    openUID?: string, // open用户id
    nickName?: string, // 用户昵称
    nsRoleDN?: string, // nsRoleDN
    otherPassword?: string, // 无线认证密码
    isAliasEdit?: string, // 别名是否可编辑
    pwdValidity?: string, // 修改密码有效期
    pwdHistorySelf?: string, // 历史密码
    pwdResetFlag?: string, // 密码重置标志
    pwdPromptFlag?: string, // 密码校验提示标志
    lxzt?: string, // 离校状态
    unionId?: string, // 身份切换默认值
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
    container?: string, // 容器
    mail?: string | null | undefined, // 邮箱
    usertype?: 'staff'|'student'|'affiliate', // 用户类型
}

export interface Attributes extends COMMON_ATTRIBUTES {
    uid?: string,
    cn?: string,
    container?: string,
    status?: 'Active' | 'Inactive',
    password?: string,
    pwdPolicy?: 1 | 2 | 3,
    memberOf?: [string],
}

export interface AttributesCreate extends COMMON_ATTRIBUTES {
    uid: string,
    cn: string,
    container: string,
    status: 'Active' | 'Inactive',
    password: string,
    pwdPolicy: 1 | 2 | 3,
    memberOf: [string],
}

export interface POST_PARAMS {
    uid?: string | null | undefined,
    data?: string | null | undefined,
    timeStamp: string,
    randomStr: string,
    sign: string,
}

export interface POST_PARAMS_MESSAGE extends POST_PARAMS {
    title: string,
    msgContent: string,
}

export interface POST_PARAMS_BINDINGUSER extends POST_PARAMS {
    defaultUid: string,
}

export interface POST_PARAMS_UIDSWITCH extends POST_PARAMS {
    defaultUserNO: string,
}

export interface COMMON_RESPONSE {
    status: string,
    data: any,
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