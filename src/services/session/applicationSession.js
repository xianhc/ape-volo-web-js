import { getUserInfo, login, logout } from '../../api/auth.js'
import { build } from '../../api/identity/menu.js'
import { useUserStore } from '../../pinia/modules/user.js'
import { useRouterStore } from '../../pinia/modules/router.js'
import { useDictionaryStore } from '../../pinia/modules/dictionary.js'
import { useScreenLockStore } from '../../pinia/modules/screenLock.js'
import router from '../../router/index.js'
import { clearToken, getApeToken, setApeToken } from './tokenStorage.js'
import { removeStoredValue } from '../storage/appStorage.js'
import { createSessionInitializer } from './sessionInitializer.js'
import { createRouteInstaller } from '../navigation/menuRoutes.js'
import { prepareMenuRoutes } from '../../utils/dynamicRouter.js'
const routes = createRouteInstaller(router)
const session = createSessionInitializer({
  identity: () => getApeToken().sessionId,
  load: async (seed) => {
    const [context, menus] = await Promise.all([
      seed ?? getUserInfo().then((result) => result.data),
      build()
    ])
    return { context, menu: prepareMenuRoutes(menus.data) }
  },
  apply: ({ context, menu }) => {
    routes.replace(menu.records)
    useRouterStore().install(menu)
    useUserStore().setSession(context)
  },
  reset: () => {
    routes.reset()
    useRouterStore().reset()
    useUserStore().reset()
    useDictionaryStore().reset()
    useScreenLockStore().reset()
  }
})
export const initializeSession = session.initialize
export function resetApplicationSession() {
  session.reset()
  for (const key of [
    'historys',
    'activeValue',
    'topActive',
    'needCloseAll',
    'role-page-context',
    'screen-lock'
  ])
    removeStoredValue(sessionStorage, key)
}
export async function signIn(username, password, captcha, captchaId) {
  const response = await login(username, password, captcha, captchaId)
  resetApplicationSession()
  setApeToken(response.data.token)
  await initializeSession(response.data)
  return response.data
}
let signingOut
export function signOut() {
  if (signingOut) return signingOut
  const identity = getApeToken().sessionId
  const pending = logout()
    .catch(() => {
      // 服务端不可用仍结束当前本地会话。
    })
    .finally(async () => {
      if (getApeToken().sessionId !== identity) return
      clearToken()
      resetApplicationSession()
      await router.replace({ name: 'Login' })
    })
    .finally(() => {
      signingOut = undefined
    })
  signingOut = pending
  return pending
}
