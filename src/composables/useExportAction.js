import { ref } from 'vue';
import { downloadFile } from "../utils/downloadFile.js";
/**
 * 从下载响应头提取文件名，解码后移除路径分隔符、控制字符和前导点。
 * @param disposition Content-Disposition 响应头原文。
 * @param fallback 响应未提供有效文件名时使用的名称。
 * @returns 可用于下载的文件名；响应头缺失或清理后为空时使用备用名。
 */
export const getDownloadFileName = (disposition, fallback) => {
    if (!disposition)
        return fallback;
    const encoded = /filename\*\s*=\s*(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition)?.[1];
    const plain = /(?:^|;)\s*filename\s*=\s*"?([^";]+)"?/i.exec(disposition)?.[1];
    const candidate = (encoded ?? plain)?.replace(/^['"]|['"]$/g, '');
    if (!candidate)
        return fallback;
    let decoded = candidate;
    try {
        decoded = decodeURIComponent(candidate);
    }
    catch {
        // Malformed percent encoding still yields a safe fallback name below.
    }
    const sanitized = Array.from(decoded, (character) => {
        const code = character.charCodeAt(0);
        return character === '/' || character === '\\' || code < 32 || code === 127
            ? '_'
            : character;
    })
        .join('')
        .replace(/^\.+/, '')
        .trim();
    return sanitized || fallback;
};
export function useExportAction(options) {
    const exporting = ref(false);
    let readinessPromise;
    /**
     * 等待查询依赖初始化，并共享同一次初始化任务。
     * @returns 查询依赖初始化成功时返回 true，否则返回 false。
     */
    const ensureReady = async () => {
        if (!options.readiness || options.readiness.ready.value)
            return true;
        readinessPromise ??= options.readiness.initialize().finally(() => {
            readinessPromise = undefined;
        });
        return readinessPromise;
    };
    /**
     * 读取当前筛选条件、请求导出文件并下载；完成或失败后释放导出忙碌状态。
     */
    const run = async () => {
        if (exporting.value)
            return;
        exporting.value = true;
        try {
            if (!(await ensureReady()))
                return;
            const response = await options.export(options.currentQuery());
            const fileName = getDownloadFileName(response.headers['content-disposition'], options.fallbackFileName ?? 'download.xlsx');
            downloadFile(response.data, fileName);
        }
        finally {
            exporting.value = false;
        }
    };
    return { exporting, run };
}
