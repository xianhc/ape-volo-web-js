import request from "../../utils/request.js";
import { encrypt, loadPasswordPublicKey } from "../../utils/rsaEncrypt.js";
import { normalizeUser, toUserQuery } from "./userAdapter.js";
/**
 * 分页查询用户列表
 * @param params - 查询参数
 * @returns 返回用户列表的Promise对象
 */
export const get = async (params, options = {}) => {
    const response = await request({
        url: '/user/get-list',
        ...options,
        method: 'get',
        params: toUserQuery(params)
    });
    return {
        ...response,
        data: { ...response.data, items: response.data.items.map(normalizeUser) }
    };
};
/**
 * 创建新用户
 * @param data - 用户写入字段
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/user/create',
        method: 'post',
        data
    });
};
/**
 * 删除用户
 * @param ids - 要删除的用户ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/user/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑用户信息
 * @param data - 用户写入字段
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/user/update',
        method: 'put',
        data
    });
};
/**
 * 导出用户数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/user/download',
        method: 'post',
        responseType: 'blob',
        data: toUserQuery(params)
    });
};
/**
 * 编辑用户角色
 * @param data - 用户角色信息
 * @returns 返回编辑结果的Promise对象
 */
export const editUserRole = (data) => {
    return request({
        url: '/user/update-role',
        method: 'put',
        data
    });
};
/**
 * 编辑用户岗位
 * @param data - 用户岗位信息
 * @returns 返回编辑结果的Promise对象
 */
export const editUserPosition = (data) => {
    return request({
        url: '/user/update-position',
        method: 'put',
        data
    });
};
/**
 * 编辑用户个人中心信息
 * @param data - 用户个人信息
 * @returns 返回编辑结果的Promise对象
 */
export function editUserCenter(data) {
    return request({
        url: '/user/update-center',
        method: 'put',
        data
    });
}
/**
 * 修改用户密码
 * @param user - 密码信息
 * @returns 返回修改结果的Promise对象
 */
export async function editUserPass(user) {
    const publicKey = await loadPasswordPublicKey();
    const [oldPassword, newPassword, confirmPassword] = await Promise.all([
        encrypt(user.oldPass, publicKey),
        encrypt(user.newPass, publicKey),
        encrypt(user.confirmPass, publicKey)
    ]);
    const data = {
        oldPassword,
        newPassword,
        confirmPassword
    };
    return request({
        url: '/user/update-password',
        method: 'put',
        data
    });
}
/**
 * 修改用户界面偏好配置
 * @param preferencesConfig - 用户界面偏好配置JSON字符串
 * @returns 返回修改结果的Promise对象
 */
export function editPreferencesConfig(preferencesConfig) {
    return request({
        url: '/user/update-preferences-config',
        method: 'put',
        data: { preferencesConfig }
    });
}
/**
 * 修改用户邮箱
 * @param form - 邮箱信息
 * @returns 返回修改结果的Promise对象
 */
export async function editUserEmail(form) {
    const data = {
        password: await encrypt(form.pass),
        email: form.email,
        code: form.code
    };
    return request({
        url: '/user/update-email',
        method: 'put',
        data
    });
}
