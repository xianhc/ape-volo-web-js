import request from "../../utils/request.js";
/**
 * 分页查询字典详情列表
 * @param params - 查询参数
 * @returns 返回字典详情列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/dict-detail/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新字典详情
 * @param data - 字典详情信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/dict-detail/create',
        method: 'post',
        data
    });
};
/**
 * 删除字典详情
 * @param ids - 要删除的字典详情ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/dict-detail/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑字典详情信息
 * @param data - 字典详情信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/dict-detail/update',
        method: 'put',
        data
    });
};
