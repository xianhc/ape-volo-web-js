import request from "../utils/request.js";
import qs from 'qs';
/**
 * 初始化数据请求
 * @param url - 请求URL
 * @param params - 查询参数
 * @returns 返回数据的Promise对象
 */
export function initData(url, params) {
    return request({
        url: url + '?' + qs.stringify(params, { indices: false }),
        method: 'get'
    });
}
/**
 * 以请求体提交数据（适用于 POST/PUT 等写入类动作）
 * @param url - 请求URL
 * @param payload - 请求体
 * @returns 返回数据的Promise对象
 */
export function postData(url, payload = {}) {
    return request({
        url,
        method: 'post',
        data: payload
    });
}
