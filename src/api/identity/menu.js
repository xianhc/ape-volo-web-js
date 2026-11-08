import request from "../../utils/request.js";
/**
 * 构建用户菜单树
 * @returns 返回用户菜单树的Promise对象
 */
export const build = () => {
    return request({
        url: '/menu/build-tree',
        method: 'post'
    });
};
/**
 * 分页查询菜单列表
 * @param params - 查询参数
 * @returns 返回菜单列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/menu/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 创建新菜单
 * @param data - 菜单写入字段
 * @returns 返回创建结果的Promise对象
 */
export const add = (data) => {
    return request({
        url: '/menu/create',
        method: 'post',
        data
    });
};
/**
 * 删除菜单
 * @param ids - 要删除的菜单ID数组
 * @returns 返回删除结果的Promise对象
 */
export const del = (ids) => {
    return request({
        url: '/menu/delete',
        method: 'delete',
        data: { ids }
    });
};
/**
 * 编辑菜单信息
 * @param data - 菜单写入字段
 * @returns 返回编辑结果的Promise对象
 */
export const edit = (data) => {
    return request({
        url: '/menu/update',
        method: 'put',
        data
    });
};
/**
 * 导出菜单数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/menu/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
/**
 * 获取所有菜单列表（不分页）
 * @returns 返回所有菜单的Promise对象
 */
export const getAll = () => {
    return request({
        url: '/menu/get-all',
        method: 'get'
    });
};
