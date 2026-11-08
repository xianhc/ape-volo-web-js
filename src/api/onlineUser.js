import request from "../utils/request.js";
/**
 * 获取在线用户列表
 * @returns 在线用户列表
 */
export const get = (params = {}, options = {}) => {
    return request({
        url: '/online/get-list',
        ...options,
        method: 'get',
        params
    });
};
/**
 * 踢出在线用户
 * @param ids 用户ID数组
 * @returns 请求结果
 */
export const del = (ids) => {
    return request({
        url: '/online/out',
        method: 'delete',
        data: { IdArray: ids }
    });
};
/**
 * 下载在线用户列表
 * @param params 查询参数
 * @returns 请求结果
 */
export const download = (params) => {
    return request({
        url: '/online/download',
        method: 'get',
        responseType: 'blob',
        params
    });
};
