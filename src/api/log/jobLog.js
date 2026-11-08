import request from "../../utils/request.js";
/**
 * 分页查询任务日志列表
 * @param params - 查询参数
 * @returns 返回任务日志列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/job-log/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 导出任务日志数据
 * @param params - 导出参数
 * @returns 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/job-log/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
