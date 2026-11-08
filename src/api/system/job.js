import { toJobRequest } from './jobAdapter.js';
import request from '@/utils/request';
/**
 * 分页查询定时任务列表
 * @param {JobQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<JobPageResponse>>} 返回定时任务列表的Promise对象
 */
export const get = (params, options = {}) => {
    return request({
        url: '/job/get-list',
        ...options,
        method: 'get',
        params: params
    });
};
/**
 * 获取所有定时任务列表
 * @returns {Promise<AxiosResponse<Job[]>>} 返回所有定时任务的Promise对象
 */
export const getAll = () => {
    return request({
        url: '/job/get-all',
        method: 'get'
    });
};
/**
 * 创建新的定时任务
 * @param {Partial<Job>} data - 定时任务信息
 * @returns {Promise<AxiosResponse<OperationResult>>} 返回创建结果的Promise对象
 */
export function add(data) {
    return request({
        url: '/job-manager/create',
        method: 'post',
        data: toJobRequest(data)
    });
}
/**
 * 删除定时任务
 * @param {EntityId[]} ids - 要删除的任务ID数组
 * @returns {Promise<AxiosResponse<OperationResult>>} 返回删除结果的Promise对象
 */
export function del(ids) {
    return request({
        url: '/job-manager/delete',
        method: 'delete',
        data: { ids }
    });
}
/**
 * 编辑定时任务信息
 * @param {Partial<Job>} data - 定时任务信息
 * @returns {Promise<AxiosResponse<OperationResult>>} 返回编辑结果的Promise对象
 */
export function edit(data) {
    return request({
        url: '/job-manager/update',
        method: 'put',
        data: toJobRequest(data)
    });
}
/**
 * 导出定时任务数据
 * @param {JobQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (params) => {
    return request({
        url: '/job/download',
        method: 'post',
        responseType: 'blob',
        data: params
    });
};
/**
 * 启用作业并启动调度，按计划触发
 * @param {EntityId} id - 任务ID
 * @returns {Promise<AxiosResponse<OperationResult>>} 返回执行结果的Promise对象
 */
export function execution(id) {
    return request({
        url: '/job-manager/execute?id=' + id,
        method: 'post'
    });
}
/**
 * 暂停定时任务
 * @param {EntityId} id - 任务ID
 * @returns {Promise<AxiosResponse<OperationResult>>} 返回暂停结果的Promise对象
 */
export function pause(id) {
    return request({
        url: '/job-manager/pause?id=' + id,
        method: 'post'
    });
}
/**
 * 恢复定时任务
 * @param {EntityId} id - 任务ID
 * @returns {Promise<AxiosResponse<OperationResult>>} 返回恢复结果的Promise对象
 */
export function resume(id) {
    return request({
        url: '/job-manager/resume?id=' + id,
        method: 'post'
    });
}
/** 停用配置并移除调度计划。 */
export function stop(id) {
    return request({ url: '/job-manager/stop', method: 'post', params: { id } });
}
/** 使用服务端最新配置重新调度。 */
export function restart(id) {
    return request({ url: '/job-manager/restart', method: 'post', params: { id } });
}
