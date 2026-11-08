import request from "../utils/request.js";
import { authClient } from "./authClient.js";
/**
 * 获取登录验证码
 * @returns 返回验证码信息的Promise对象
 */
export const getLoginCaptcha = () => {
    return authClient({
        url: '/auth/captcha',
        method: 'get'
    });
};
/**
 * 获取重置密码邮箱验证码
 * @param data - 邮箱信息
 * @returns 返回发送结果的Promise对象
 */
export const getResetEmailCode = (data) => {
    return request({
        url: '/auth/reset-email-code',
        method: 'post',
        data
    });
};
