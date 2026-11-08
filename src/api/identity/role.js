import request from "../../utils/request.js";
/**
 * 分页查询角色列表
 * @param params - 查询参数
 * @returns 返回角色列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/role/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新角色
 * @param data - 角色写入字段
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/role/create',
        method: 'post',
        data
    });
};
/**
 * 删除角色
 * @param ids - 要删除的角色ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/role/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑角色信息
 * @param data - 角色写入字段
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/role/update',
        method: 'put',
        data
    });
};
/**
 * 导出角色数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/role/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
/**
 * 获取单个角色信息
 * @param params - 查询参数
 * @returns 返回角色详情的Promise对象
 */
export const single = (params) => {
    return request({
        url: '/role/get-with-details',
        method: 'get',
        params
    });
};
/**
 * 编辑角色菜单权限
 * @param data - 角色菜单权限信息
 * @returns 返回编辑结果的Promise对象
 */
export const editRoleMenu = (data) => {
    return request({
        url: '/role/update-role-menu',
        method: 'put',
        data
    });
};
/**
 * 获取所有角色列表（不分页）
 * @returns 返回所有角色的Promise对象
 */
export const getAll = () => {
    return request({
        url: '/role/get-all',
        method: 'get'
    });
};
