import request from "../../utils/request.js";
/**
 * 分页查询存储文件列表
 * @param params - 查询参数
 * @returns 返回存储文件列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/file-record/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 上传文件
 * @param data - 包含文件的FormData对象
 * @returns 返回上传结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/file-record/create',
        method: 'post',
        data
    });
};
/**
 * 删除存储文件
 * @param ids - 要删除的文件ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/file-record/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑存储文件信息
 * @param data - 文件信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/file-record/update',
        method: 'put',
        data
    });
};
/**
 * 导出存储文件数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/file-record/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
