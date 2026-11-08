/**
 * 从未知错误中提取接口错误响应体。
 * @param error HTTP 请求捕获的未知错误。
 * @returns HTTP 错误中的响应正文；不能识别时为 undefined。
 */
export function apiErrorBody(error) {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response;
        if (response && typeof response === 'object' && 'data' in response)
            return response.data;
    }
}
