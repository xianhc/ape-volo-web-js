import { MenuType } from "../../enums/MenuType.js";
export function toMenuRequest(draft) {
    return {
        id: draft.id, title: draft.title, menuType: draft.menuType, sort: draft.sort, parentId: draft.parentId,
        keepAlive: draft.keepAlive, enabled: draft.enabled, hidden: draft.hidden,
        path: draft.path, component: draft.component, componentName: draft.componentName, icon: draft.icon,
        authCode: [MenuType.Menu, MenuType.Button].includes(draft.menuType) ? draft.authCode : undefined
    };
}
