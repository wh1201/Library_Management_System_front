import jwt from 'jsonwebtoken';
import crypto from 'crypto';



/**
 * 生成随机加密的token
 * @param username 用户名
 * @param password 密码
 * @returns 加密的token字符串
 */
export function generateEncryptedToken(username: string, password: string): string {
    // 生成随机盐值
    const salt = crypto.randomBytes(16).toString('hex');
    
    // 创建基础payload
    const payload = {
        username,
        salt,
        timestamp: Date.now(),
        // 添加随机字符串增加唯一性
        nonce: crypto.randomBytes(8).toString('hex')
    };
    
    // 使用账号密码的组合作为密钥的一部分
    const secretKey = crypto
        .createHash('sha256')
        .update(`${username}_${password}_${process.env.JWT_SECRET || 'default_secret'}`)
        .digest('hex');
    
    // 生成JWT token
    const token = jwt.sign(payload, secretKey, {
        expiresIn: '7d', // token有效期7天
        algorithm: 'HS256'
    });
    
    return token;
}

/**
 * 验证token是否有效
 * @param token 要验证的token
 * @param username 用户名
 * @param password 密码
 * @returns 验证结果
 */
export function verifyToken(token: string, username: string, password: string): boolean {
    try {
        const secretKey = crypto
            .createHash('sha256')
            .update(`${username}_${password}_${process.env.JWT_SECRET || 'default_secret'}`)
            .digest('hex');
        
        const decoded = jwt.verify(token, secretKey) as any;
        return decoded.username === username;
    } catch (error) {
        return false;
    }
}

/**
 * 直接设置Cookie
 * @param value Cookie值（直接传入，不做额外处理）
 */
export function setCookie(value: string | undefined): void {
    if (typeof window !== 'undefined') {
        document.cookie = `token=${value}; path=/`;
    }
}

/**
 * 获取Cookie
 * @returns Cookie值
 */
export function getCookie(): string | undefined {
    // 直接从浏览器获取cookie
    return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
}