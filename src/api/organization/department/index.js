import request from "../../../utils/request.js";
import { buildDepartmentTree } from "./adapter.js";
/**
 * 分页查询部门列表
 * @param params - 查询参数
 * @returns 返回部门列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/department/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新部门
 * @param data - 部门信息
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/department/create',
        method: 'post',
        data
    });
};
/**
 * 删除部门
 * @param ids - 要删除的部门ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/department/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑部门信息
 * @param data - 部门信息
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/department/update',
        method: 'put',
        data
    });
};
/**
 * 导出部门数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/department/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
/**
 * 获取部门树结构
 * @returns 返回部门树的Promise对象
 */
export const getDeptTree = async (options = {}) => {
    const response = await request({
        url: '/department/get-all',
        ...options,
        method: 'get'
    });
    return { ...response, data: buildDepartmentTree(response.data) };
};
