import request from "../../../utils/request.js";
/**
 * 分页查询邮件模板列表
 * @param params - 查询参数
 * @returns 返回邮件模板列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/email-message-template/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新邮件模板
 * @param data - 邮件模板信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/email-message-template/create',
        method: 'post',
        data
    });
};
/**
 * 删除邮件模板
 * @param ids - 要删除的邮件模板ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/email-message-template/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑邮件模板信息
 * @param data - 邮件模板信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/email-message-template/update',
        method: 'put',
        data
    });
};
