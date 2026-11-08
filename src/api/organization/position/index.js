import request from "../../../utils/request.js";
/**
 * 分页查询岗位列表
 * @param params - 查询参数
 * @returns 返回岗位列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/position/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 获取所有岗位列表（不分页）
 * @returns 返回所有岗位的Promise对象
 */
export const getAll = () => {
    return request({
        url: '/position/get-all',
        method: 'get'
    });
};
/**
 * 创建新岗位
 * @param data - 岗位信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/position/create',
        method: 'post',
        data
    });
};
/**
 * 删除岗位
 * @param ids - 要删除的岗位ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/position/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑岗位信息
 * @param data - 岗位信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/position/update',
        method: 'put',
        data
    });
};
/**
 * 导出岗位数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/position/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
