import { createPinia } from 'pinia';
import { useAppStore } from "./modules/app.js";
import { useUserStore } from "./modules/user.js";
const store = createPinia();
export function setupStore(app) {
    app.use(store);
}
export { store, useAppStore, useUserStore };
