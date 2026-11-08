import { hasPerm, hasRole } from "./permission/index.js";
export function setupDirective(app) {
    app.directive('hasRole', hasRole);
    app.directive('hasPerm', hasPerm);
}
