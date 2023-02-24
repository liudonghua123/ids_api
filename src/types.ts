

export interface COMMON_ATTRIBUTES {
    
    /**
     * 用户编码
     */
    uid?: string,
    
    /**
     * 姓氏
     */
    sn?: string,
    
    /**
     * 姓名
     */
    cn?: string,
    
    /**
     * 密码
     */
    password?: string,
    
    /**
     * 别名
     */
    alias?: string,
    
    /**
     * 公钥
     */
    publicKey?: string,
    
    /**
     * 密码保护问题
     */
    pwdProtectQuestion?: string,
    
    /**
     * 密码保护答案
     */
    pwdProtectAnswer?: string,
    
    /**
     * 生日
     */
    birthday?: string,
    
    /**
     * 密码找回邮箱
     */
    securityEmail?: string,
    
    /**
     * 性别
     */
    gender?: string,
    
    /**
     * QQ号
     */
    qq?: string,
    
    /**
     * 个人主页
     */
    homePage?: string,
    
    /**
     * 个人签名
     */
    signature?: string,
    
    /**
     * 是否公开
     */
    privacyProtect?: string,

    /**
     * 成员组
     * common group name:
     * 教职工：'10'
     * 离校学生：'lxxs'
     * 校友：'alumnus'
     * 本科生：'bk'
     */
    memberOf?: [string],
    
    /**
     * 过期时间
     * 格式类似于 2023/02/22 12:12:12
     */
    lifeTime?: string,
    
    /**
     * 帐号状态
     * Active: 活动
     * Inactive: 不活动
     */
    status?: 'Active' | 'Inactive',
    
    /**
     * 学号
     */
    eduPersonStudentID?: string,
    
    /**
     * 工号
     */
    eduPersonStaffID?: string,
    
    /**
     * 证件号
     * 一般为身份证号码或护照号
     */
    eduPersonCardID?: string,
    
    /**
     * 专业
     */
    eduPersonMajor?: string,
    
    /**
     * 地址
     */
    eduPersonStreet?: string,
    
    /**
     * 所属单位
     */
    eduPersonOrgDN?: string,
    
    /**
     * 密码策略
     * 1: 弱
     * 2: 中
     * 3: 强
     */
    pwdPolicy?: 1 | 2 | 3,
    
    /**
     * 用户来源
     */
    addFrom?: string,
    
    /**
     * 电话号码
     */
    telephoneNumber?: string,
    
    /**
     * 手机是否验证
     */
    isPhoneValidated?: 0 | 1,
    
    /**
     * 邮箱是否验证
     */
    isEmailValidated?: 0 | 1,
    
    /**
     * 无线认证md4密码
     */
    md4Password?: string,
    
    /**
     * open用户id
     */
    openUID?: string,
    
    /**
     * 用户昵称
     */
    nickName?: string,
    
    /**
     * nsRoleDN
     */
    nsRoleDN?: string,
    
    /**
     * 无线认证密码
     */
    otherPassword?: string,
    
    /**
     * 别名是否可编辑
     */
    isAliasEdit?: string,
    
    /**
     * 修改密码有效期
     */
    pwdValidity?: string,
    
    /**
     * 历史密码
     */
    pwdHistorySelf?: string,
    
    /**
     * 密码重置标志
     */
    pwdResetFlag?: string,
    
    /**
     * 密码校验提示标志
     */
    pwdPromptFlag?: string,
    
    /**
     * 离校状态
     */
    lxzt?: string,
    
    /**
     * 身份切换默认值
     */
    unionId?: string,
    
    /**
     * 容器
     * common container name: 
     * 本科生：'ou=bk,ou=student,ou=People' 
     * 研究生：'ou=yjs,ou=student,ou=People'
     * 教职工：'ou=jzg,ou=People'
     * 附属：'ou=affiliate,ou=People'
     * 校友：'ou=alumnus,ou=People'
     * 外聘：'ou=external,ou=People'
     */
    container?: string,
    
    /**
     * 邮箱
     */
    mail?: string,
    
    /**
     * 用户类型
     */
    usertype?: 'staff'|'student'|'affiliate',
}

export interface ATTRIBUTES extends COMMON_ATTRIBUTES {
    uid?: string,
    cn?: string,
    container?: string,
    status?: 'Active' | 'Inactive',
    password?: string,
    pwdPolicy?: 1 | 2 | 3,
    memberOf?: [string],
}

export interface ATTRIBUTES_CREATE extends COMMON_ATTRIBUTES {
    uid: string,
    cn: string,
    container: string,
    status: 'Active' | 'Inactive',
    password: string,
    pwdPolicy: 1 | 2 | 3,
    memberOf: [string],
}

export interface POST_PARAMS {
    uid?: string,
    data?: string,
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