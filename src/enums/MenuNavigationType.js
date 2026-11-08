/**
 * 菜单导航类型枚举
 */
export var MenuNavigationType;
(function (MenuNavigationType) {
    /** 侧边栏导航 */
    MenuNavigationType[MenuNavigationType["SidebarNav"] = 1] = "SidebarNav";
    /** 顶部导航 */
    MenuNavigationType[MenuNavigationType["TopNav"] = 2] = "TopNav";
    /** 双侧边栏导航 */
    MenuNavigationType[MenuNavigationType["DualSidebarNav"] = 3] = "DualSidebarNav";
    /** 混合导航 */
    MenuNavigationType[MenuNavigationType["CombinationNav"] = 4] = "CombinationNav";
    /** 顶部与完整侧栏混合导航 */
    MenuNavigationType[MenuNavigationType["MixedNav"] = 5] = "MixedNav";
    /** 顶部与双列侧栏混合导航 */
    MenuNavigationType[MenuNavigationType["HeaderMixedNav"] = 6] = "HeaderMixedNav";
    /** 全内容布局 */
    MenuNavigationType[MenuNavigationType["FullContent"] = 7] = "FullContent";
})(MenuNavigationType || (MenuNavigationType = {}));
/**
 * 判断导航模式是否包含侧栏导航。
 * @param mode 当前界面选用的菜单导航布局。
 * @returns 当前布局包含侧栏导航时返回 true。
 */
export const hasSidebarNavigation = (mode) => [
    MenuNavigationType.SidebarNav,
    MenuNavigationType.DualSidebarNav,
    MenuNavigationType.CombinationNav,
    MenuNavigationType.MixedNav,
    MenuNavigationType.HeaderMixedNav
].includes(mode);
/**
 * 判断导航模式是否包含顶部导航。
 * @param mode 当前界面选用的菜单导航布局。
 * @returns 当前布局包含顶部导航时返回 true。
 */
export const hasHeaderNavigation = (mode) => [
    MenuNavigationType.TopNav,
    MenuNavigationType.CombinationNav,
    MenuNavigationType.MixedNav,
    MenuNavigationType.HeaderMixedNav
].includes(mode);
/**
 * 判断导航模式是否使用双侧栏导航。
 * @param mode 当前界面选用的菜单导航布局。
 * @returns 当前布局包含双侧栏导航时返回 true。
 */
export const hasDualSidebarNavigation = (mode) => mode === MenuNavigationType.DualSidebarNav ||
    mode === MenuNavigationType.HeaderMixedNav;
