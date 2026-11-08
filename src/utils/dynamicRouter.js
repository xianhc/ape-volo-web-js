import IframeView from "../components/IframeView.vue";
import { componentNames } from 'virtual:route-component-names';
import { compileMenuRoutes } from "../services/navigation/menuRoutes.js";
const viewModules = import.meta.glob('../views/**/*.vue');
const modules = Object.fromEntries(Object.entries(viewModules).map(([path, loader]) => [path.replace('../', '/src/'), loader]));
export const prepareMenuRoutes = (menus) => compileMenuRoutes(menus, {
    modules, names: componentNames, iframe: IframeView
});
