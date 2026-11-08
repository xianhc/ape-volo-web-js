import { inject, provide } from 'vue';
const formKey = Symbol('crud-form');
export function provideCrudForm(context) {
    provide(formKey, context);
}
/** 泛型断言只放在注入入口；业务表单必须声明自己的模型。 */
export function useCrudForm() {
    const context = inject(formKey);
    if (!context)
        throw new Error('CRUD form must be rendered inside its CRUD provider');
    return context;
}
