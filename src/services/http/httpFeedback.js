let handlers = { error: () => { }, expired: () => { }, forbidden: () => { } };
const reported = new WeakSet();
/** 应用启动时连接 UI；请求核心无需导入 Element Plus、路由或 Store。 */
export function configureHttpFeedback(next) { handlers = next; }
export const httpFeedback = {
    error(error) {
        if (error && typeof error === 'object') {
            if (reported.has(error))
                return;
            reported.add(error);
        }
        handlers.error(error);
    },
    expired: () => handlers.expired(),
    forbidden: () => handlers.forbidden()
};

