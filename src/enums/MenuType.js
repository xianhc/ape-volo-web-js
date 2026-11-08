/**
 * 菜单类型枚举
 */
export var MenuType;
(function (MenuType) {
    /** 目录 */
    MenuType[MenuType["Catalog"] = 1] = "Catalog";
    /** 菜单 */
    MenuType[MenuType["Menu"] = 2] = "Menu";
    /** 按钮 */
    MenuType[MenuType["Button"] = 3] = "Button";
    /** 内嵌 */
    MenuType[MenuType["InternalLink"] = 4] = "InternalLink";
    /** 外链 */
    MenuType[MenuType["ExternalLink"] = 5] = "ExternalLink";
})(MenuType || (MenuType = {}));
