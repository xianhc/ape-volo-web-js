import { defineStore } from 'pinia';
import { ref } from 'vue';
const emptyUser = () => ({ id: '', userName: '', nickName: '', headerImg: '', genderCode: 0, email: '', phone: '', dept: {}, authority: {}, roleCodes: [], authCodes: [] });
/** Store 只保存当前身份，登录、路由和 UI 由应用会话入口协调。 */
export const useUserStore = defineStore('user', () => {
    const userInfo = ref(emptyUser());
    const setSession = (context) => { userInfo.value = context.user; };
    const ResetUserInfo = (patch) => { userInfo.value = { ...userInfo.value, ...patch }; };
    const reset = () => { userInfo.value = emptyUser(); };
    return { userInfo, setSession, ResetUserInfo, reset };
});
