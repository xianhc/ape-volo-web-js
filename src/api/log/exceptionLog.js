import request from "../../utils/request.js";
/**
 * 分页查询异常日志列表
 * @param params - 查询参数
 * @returns 返回异常日志列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/exception-log/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
