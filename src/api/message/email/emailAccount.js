import request from "../../../utils/request.js";
/**
 * 分页查询邮箱账户列表
 * @param params - 查询参数
 * @returns 返回邮箱账户列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/email-account/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新邮箱账户
 * @param data - 邮箱账户信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/email-account/create',
        method: 'post',
        data
    });
};
/**
 * 删除邮箱账户
 * @param ids - 要删除的邮箱账户ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/email-account/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑邮箱账户信息
 * @param data - 邮箱账户信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/email-account/update',
        method: 'put',
        data
    });
};
/**
 * 获取所有邮箱账户列表（不分页）
 * @returns 返回所有邮箱账户的Promise对象
 */
export const getAll = () => {
    return request({
        url: '/email-account/get-all',
        method: 'get'
    });
};
