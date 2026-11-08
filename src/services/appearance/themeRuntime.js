/**
 * 未保存个性化偏好时使用的默认蓝色，也是共用色板的第一项。
 */
export const DEFAULT_PRIMARY_COLOR = '#2563eb';
/**
 * 将颜色输入转换为规范的十六进制表示。
 * @param color 待校验或应用的颜色值。
 * @returns 规范的六位十六进制颜色；输入无效时采用默认主色。
 */
const normalizeHexColor = (color) => {
    const match = /^#?([\da-f]{6})$/i.exec(color.trim());
    return match ? `#${match[1].toUpperCase()}` : DEFAULT_PRIMARY_COLOR;
};
/**
 * 将颜色输入转换为规范的十六进制表示。
 * @param color 待校验或应用的颜色值。
 * @returns 颜色对应的红、绿、蓝三个通道数值。
 */
const colorToHex = (color) => {
    const normalized = normalizeHexColor(color).slice(1);
    return [
        Number.parseInt(normalized.slice(0, 2), 16),
        Number.parseInt(normalized.slice(2, 4), 16),
        Number.parseInt(normalized.slice(4, 6), 16)
    ];
};
/**
 * RGB 值转换为十六进制颜色字符串
 * @function hexToColor
 * @description 将 RGB 三个数值转换为十六进制颜色字符串
 *
 * @param red - 红色值 (0-255)
 * @param green - 绿色值 (0-255)
 * @param blue - 蓝色值 (0-255)
 * @returns 十六进制颜色字符串（如 '#FF0000'）
 */
const hexToColor = (red, green, blue) => {
    const channels = [red, green, blue].map(channel => Math.round(channel).toString(16).padStart(2, '0'));
    return `#${channels.join('')}`;
};
/**
 * 混合两个颜色
 * @function mixColor
 * @description 按比例将主题色混合到目标表面色
 *
 * @param color - 基础颜色（十六进制）
 * @param target - 目标颜色（十六进制）
 * @param ratio - 混合比例 (0-1)
 * @returns 混合后的颜色（十六进制）
 */
const mixColor = (color, target, ratio) => {
    const sourceChannels = colorToHex(color);
    const targetChannels = colorToHex(target);
    const mixedChannels = [
        sourceChannels[0] * (1 - ratio) + targetChannels[0] * ratio,
        sourceChannels[1] * (1 - ratio) + targetChannels[1] * ratio,
        sourceChannels[2] * (1 - ratio) + targetChannels[2] * ratio
    ];
    return hexToColor(...mixedChannels);
};
/**
 * 计算颜色相对亮度
 * @function relativeLuminance
 * @description 按 WCAG 相对亮度公式计算颜色亮度
 *
 * @param color - 十六进制颜色
 * @returns 相对亮度
 */
const relativeLuminance = (color) => {
    const channels = colorToHex(color).map(channel => {
        const normalized = channel / 255;
        return normalized <= 0.04045
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
/**
 * 按相对亮度计算前景色与背景色的对比度。
 * @param foreground 前景颜色。
 * @param background 背景颜色。
 * @returns 两种颜色的对比度比值，值越大表示亮度差异越明显。
 */
export const getContrastRatio = (foreground, background) => {
    const foregroundLuminance = relativeLuminance(foreground);
    const backgroundLuminance = relativeLuminance(background);
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);
    return (lighter + 0.05) / (darker + 0.05);
};
/**
 * 为颜色添加透明度
 * @function addOpacityToColor
 * @description 将十六进制颜色转换为带透明度的 RGBA 颜色
 *
 * @param color - 十六进制颜色字符串
 * @param opacity - 透明度 (0-1)
 * @returns RGBA 颜色字符串
 *
 * @example
 * addOpacityToColor('#FF0000', 0.5) // 'rgba(255, 0, 0, 0.5)'
 */
function addOpacityToColor(color, opacity) {
    const [red, green, blue] = colorToHex(color);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
/**
 * 设置主题色
 * @function setBodyPrimaryColor
 * @description 设置全局主题色和相关的颜色变量
 *
 * 功能：
 * - 设置主色调
 * - 根据深色/浅色模式生成色阶
 * - 设置菜单悬停颜色
 *
 * @param primaryColor - 主题色（十六进制）
 * @param darkMode - 主题模式
 *
 * @example
 * setBodyPrimaryColor('#006be6', 'light')
 * setBodyPrimaryColor('#006be6', 'dark')
 */
export const setBodyPrimaryColor = (primaryColor, darkMode) => {
    const normalizedColor = normalizeHexColor(primaryColor);
    const lightTarget = darkMode === 'light' ? '#FFFFFF' : '#14161A';
    const darkTarget = darkMode === 'light' ? '#000000' : '#FFFFFF';
    const primaryOn = getContrastRatio('#FFFFFF', normalizedColor) >= 4.5
        ? '#FFFFFF'
        : '#1F292E';
    document.documentElement.style.setProperty('--el-color-primary', normalizedColor);
    document.documentElement.style.setProperty('--app-primary-on', primaryOn);
    document.documentElement.style.setProperty('--el-color-primary-bg', addOpacityToColor(normalizedColor, darkMode === 'light' ? 0.12 : 0.2));
    for (let times = 1; times <= 2; times++) {
        document.documentElement.style.setProperty(`--el-color-primary-dark-${times}`, mixColor(normalizedColor, darkTarget, times / 10));
    }
    for (let times = 1; times <= 10; times++) {
        document.documentElement.style.setProperty(`--el-color-primary-light-${times}`, mixColor(normalizedColor, lightTarget, times / 10));
    }
    document.documentElement.style.setProperty(`--el-menu-hover-bg-color`, 'var(--app-surface-subtle)');
};
/**
 * 设置圆角大小
 * @function setCornerSize
 * @description 设置全局圆角大小的 CSS 变量
 *
 * @param cornerSize - 圆角大小（单位：rem）
 *
 * @example
 * setCornerSize(0.5) // 设置圆角为 0.5rem
 * setCornerSize(1) // 设置圆角为 1rem
 */
export const setCornerSize = (cornerSize) => {
    document.documentElement.style.setProperty('--ape-volo-radius', cornerSize + 'rem');
};
