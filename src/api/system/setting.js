import request from "../../utils/request.js";
/**
 * 分页查询系统配置列表
 * @param params - 查询配置
 * @returns 返回系统配置列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/setting/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新的系统配置
 * @param data - 系统配置信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/setting/create',
        method: 'post',
        data
    });
};
/**
 * 删除系统配置
 * @param ids - 要删除的配置ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/setting/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑系统配置信息
 * @param data - 系统配置信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/setting/update',
        method: 'put',
        data
    });
};
/**
 * 导出系统配置数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/setting/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
