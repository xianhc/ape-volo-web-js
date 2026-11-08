import request from "../../utils/request.js";
/**
 * 分页查询操作日志列表
 * @param params - 查询参数
 * @returns 返回操作日志列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/operate-log/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 获取当前用户操作日志
 * @param params - 查询参数
 * @returns 返回当前用户操作日志的Promise对象
 */
export const getCurrent = (params) => {
    return request({
        url: '/operate-log/get-by-current',
        method: 'get',
        params
    });
};
/**
 * 获取访问趋势统计数据
 * @param days - 天数
 * @returns 返回访问趋势数据的Promise对象
 */
export const getVisitTrend = (days) => {
    return request({
        url: '/operate-log/get-operation-number',
        method: 'get',
        params: { days }
    });
};
