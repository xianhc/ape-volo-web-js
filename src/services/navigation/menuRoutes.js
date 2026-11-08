import { MenuType } from "../../enums/MenuType.js";
import { toHttpUrl } from "./menuNavigation.js";
export const normalizeViewPath = (value) => {
    let path = value.replace(/^\/?src\//, '').replace(/^\//, '');
    if (!path.startsWith('views/'))
        path = `views/${path}`;
    if (!path.endsWith('.vue'))
        path += '.vue';
    if (path.split('/').includes('..'))
        throw new Error('Invalid view path');
    return `/src/${path}`;
};
/** 菜单 DTO、导航树和路由记录分别持有，转换不改写服务端数据。 */
export function compileMenuRoutes(source, registry) {
    const byName = {};
    const cacheNames = {};
    const allowedCacheNames = new Set();
    const cloneNodes = (items) => items.map(({ parent: _parent, ...item }) => ({
        ...item,
        meta: { ...item.meta },
        parameters: item.parameters?.map(parameter => ({ ...parameter })),
        children: item.children ? cloneNodes(item.children) : undefined
    }));
    const nodes = cloneNodes(source);
    nodes.push({ path: 'reload', name: 'Reload', hidden: true, meta: { closeTab: true }, component: 'views/error/reload.vue' });
    const compile = (node, parent) => {
        node.parent = parent;
        node.meta = { ...node.meta, hidden: node.hidden ?? node.meta?.hidden };
        if (node.menuType === MenuType.ExternalLink) {
            const url = toHttpUrl(node.component || node.name);
            if (!url)
                throw new Error('外链菜单必须使用完整的 HTTP 或 HTTPS 地址');
            node.component = url;
            node.name = url;
        }
        if (node.name) {
            if (byName[node.name])
                throw new Error(`Duplicate route name: ${node.name}`);
            byName[node.name] = node;
        }
        const children = node.children?.map(child => compile(child, node)).filter((child) => Boolean(child));
        if (node.menuType === MenuType.ExternalLink || node.menuType === MenuType.Button)
            return undefined;
        let component;
        let componentName;
        if (node.menuType === MenuType.InternalLink || node.meta.iframeUrl) {
            const url = toHttpUrl(node.meta.iframeUrl || node.component);
            if (!url)
                throw new Error('内嵌菜单必须使用完整的 HTTP 或 HTTPS 地址');
            node.meta.iframeUrl = url;
            component = registry.iframe;
            componentName = 'IFrame';
        }
        else if (node.component) {
            const path = normalizeViewPath(node.component);
            component = registry.modules[path];
            if (!component)
                throw new Error(`Unknown view: ${node.component}`);
            node.meta.path = path;
            componentName = registry.names[path];
        }
        if (node.name && componentName) {
            cacheNames[node.name] = componentName;
            if (node.meta.keepAlive || node.children?.some(child => child.meta?.keepAlive))
                allowedCacheNames.add(componentName);
        }
        return { path: node.path, name: node.name, meta: { ...node.meta }, component, children };
    };
    const root = { path: '/layout', name: 'layout', component: 'views/layout/index.vue', children: nodes };
    const record = compile(root, null);
    return { tree: [root], records: record ? [record] : [], byName, cacheNames, allowedCacheNames: [...allowedCacheNames] };
}
/** 注册失败时回滚已添加记录；退出时通过 Router 返回的注销句柄清理。 */
export function createRouteInstaller(router) {
    let removers = [];
    const reset = () => { for (const remove of removers.reverse())
        remove(); removers = []; };
    const replace = (routes) => {
        reset();
        try {
            for (const route of routes)
                removers.push(router.addRoute(route));
        }
        catch (error) {
            reset();
            throw error;
        }
    };
    return { replace, reset };
}
