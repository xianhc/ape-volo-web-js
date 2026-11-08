import { SessionChangedError } from "./tokenRefresh.js";
/** 只在加载成功且身份仍一致后发布会话；失败可重试，重置使旧任务失效。 */
export function createSessionInitializer(dependencies) {
    let generation = 0;
    let ready = '';
    let pending;
    const reset = () => {
        generation++;
        ready = '';
        pending = undefined;
        dependencies.reset();
    };
    const initialize = (seed) => {
        const identity = dependencies.identity();
        if (!identity)
            return Promise.reject(new SessionChangedError('No active session'));
        if (ready === identity)
            return Promise.resolve();
        if (pending?.identity === identity)
            return pending.promise;
        const ticket = generation;
        const promise = Promise.resolve().then(() => dependencies.load(seed)).then((value) => {
            if (ticket !== generation || dependencies.identity() !== identity)
                throw new SessionChangedError('Session changed during initialization');
            dependencies.apply(value);
            ready = identity;
        }).catch((error) => {
            if (ticket === generation && dependencies.identity() === identity) {
                ready = '';
                dependencies.reset();
            }
            throw error;
        }).finally(() => {
            if (pending?.promise === promise)
                pending = undefined;
        });
        pending = { identity, promise };
        return promise;
    };
    return { initialize, reset };
}
