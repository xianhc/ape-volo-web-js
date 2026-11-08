import { defineAsyncComponent } from 'vue';
import AppIcon from "../components/AppIcon.vue";
export const setupIcons = (app) => {
    app.component('AppIcon', AppIcon);
    app.component('IconPicker', defineAsyncComponent(() => import("../components/IconPicker.vue")));
};
