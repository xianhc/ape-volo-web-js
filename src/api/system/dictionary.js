import request from "../../utils/request.js";
/**
 * 分页查询字典列表
 * @param params - 查询参数
 * @returns 返回字典列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/dict/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新字典
 * @param data - 字典信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/dict/create',
        method: 'post',
        data
    });
};
/**
 * 删除字典
 * @param ids - 要删除的字典ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/dict/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑字典信息
 * @param data - 字典信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/dict/update',
        method: 'put',
        data
    });
};
/**
 * 导出字典数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/dict/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
/**
 * 获取单个字典信息
 * @param params - 查询参数
 * @returns 返回字典详情的Promise对象
 */
export const single = (params) => {
    return request({
        url: '/dict/get-by-name',
        method: 'get',
        params
    });
};
