import request from "../../utils/request.js";
/**
 * 分页查询应用密钥列表
 * @param params - 查询参数
 * @returns 返回应用密钥列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/app-secret/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新应用密钥
 * @param data - 应用密钥信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/app-secret/create',
        method: 'post',
        data
    });
};
/**
 * 删除应用密钥
 * @param ids - 要删除的应用密钥ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/app-secret/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑应用密钥信息
 * @param data - 应用密钥信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/app-secret/update',
        method: 'put',
        data
    });
};
/**
 * 导出应用密钥数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/app-secret/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
