/**
 * 取得适合当前界面展示的错误信息。
 * @param error 当前捕获的未知错误。
 * @returns 只包含错误名称与消息的安全摘要；未知结构为 undefined。
 */
const safeError = (error) => error instanceof Error
    ? { name: error.name, message: error.message }
    : undefined;
export const appLogger = {
    /**
     * 在开发环境输出经过安全整理的警告信息。
     * @param message 供调用方阅读的结果说明。
     * @param error 当前捕获的未知错误。
     */
    warn(message, error) {
        if (import.meta.env.DEV)
            console.warn(message, safeError(error));
    },
    /**
     * 在开发环境输出经过安全整理的错误信息。
     * @param message 供调用方阅读的结果说明。
     * @param error 当前捕获的未知错误。
     */
    error(message, error) {
        if (import.meta.env.DEV)
            console.error(message, safeError(error));
    }
};
