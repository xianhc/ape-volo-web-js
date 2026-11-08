const STORAGE_VERSION = 1;
/**
 * 检查存储值是否包含数值格式版本及业务值封装；业务值结构由调用方守卫校验。
 * @param value 本次转换、校验或更新所接收的值。
 * @returns 输入满足目标类型要求的必要字段与值约束时返回 true。
 */
const isStoredValue = (value) => typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    typeof value.version === 'number' &&
    'value' in value;
/**
 * 移除指定存储项；浏览器禁止访问存储时忽略删除失败。
 * @param storage 待操作的浏览器存储。
 * @param key 待删除的存储键。
 */
export const removeStoredValue = (storage, key) => {
    try {
        storage.removeItem(key);
    }
    catch {
        // Storage may be unavailable in hardened browser contexts.
    }
};
/**
 * 读取浏览器存储文本；键不存在或存储不可访问时使用备用值。
 * @param storage localStorage、sessionStorage 或同协议存储。
 * @param key 待读取的存储键。
 * @param fallback 键缺失或读取失败时返回的文本。
 * @returns 已存储的文本或调用方提供的备用值。
 */
export function readStoredText(storage, key, fallback) {
    try {
        return storage.getItem(key) ?? fallback;
    }
    catch {
        return fallback;
    }
}
/**
 * 写入浏览器存储文本；配额不足或存储被禁用时忽略写入失败。
 * @param storage 待操作的浏览器存储。
 * @param key 待写入的存储键。
 * @param value 待保存的原始文本。
 */
export function writeStoredText(storage, key, value) {
    try {
        storage.setItem(key, value);
    }
    catch {
        // Persistence is optional when storage is blocked or its quota is full.
    }
}
export function readStoredJson(storage, key, fallback, guard) {
    try {
        const serialized = storage.getItem(key);
        if (!serialized)
            return fallback;
        const parsed = JSON.parse(serialized);
        const candidate = isStoredValue(parsed) ? parsed.value : parsed;
        if (!guard(candidate))
            throw new Error('Invalid stored value');
        if (!isStoredValue(parsed) || parsed.version !== STORAGE_VERSION) {
            writeStoredJson(storage, key, candidate);
        }
        return candidate;
    }
    catch {
        removeStoredValue(storage, key);
        return fallback;
    }
}
export function writeStoredJson(storage, key, value) {
    try {
        storage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, value }));
    }
    catch {
        // Persistence is optional when storage is blocked or its quota is full.
    }
}
