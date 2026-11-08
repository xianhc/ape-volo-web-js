import ElementPlus from 'element-plus';
import { setupDirective } from "../directive/index.js";
import { setupRouter } from "../router/index.js";
import { setupStore } from "../pinia/index.js";
import { setupIcons } from "./icons.js";
import { setupPermission } from "./permission.js";
import { setupHttpFeedback } from "./http.js";
export default {
    install(app) {
        // Element Plus
        app.use(ElementPlus);
        // 仓储
        setupStore(app);
        setupDirective(app);
        setupHttpFeedback();
        // Icon
        setupIcons(app);
        // 路由守卫
        setupPermission();
        setupRouter(app);
    }
};
