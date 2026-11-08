import request from "../../../utils/request.js";
/**
 * 分页查询邮件队列列表
 * @param params - 查询参数
 * @returns 返回邮件队列列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/queued-email/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新邮件队列
 * @param data - 邮件队列信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/queued-email/create',
        method: 'post',
        data
    });
};
/**
 * 删除邮件队列
 * @param ids - 要删除的邮件队列ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/queued-email/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑邮件队列信息
 * @param data - 邮件队列信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/queued-email/update',
        method: 'put',
        data
    });
};
