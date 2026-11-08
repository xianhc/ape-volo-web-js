import { createHttpClient } from '../services/http/client.js'
import { httpFeedback } from '../services/http/httpFeedback.js'
import setting from '../setting.js'
import { encrypt } from '../utils/rsaEncrypt.js'
import { getApeToken } from '../services/session/tokenStorage.js'
import { normalizeAuthContext, normalizeTokenResponse } from './authAdapter.js'
/** 登录、刷新和退出不经过受保护接口的鉴权拦截器。 */
export const authClient = createHttpClient({
  config: { baseURL: import.meta.env.VITE_BASE_API, timeout: setting.timeout },
  feedback: httpFeedback
})
export async function login(username, password, captcha, captchaId) {
  const response = await authClient.post('/auth/login', {
    username,
    password: await encrypt(password),
    captcha,
    captchaId
  })
  return {
    ...response,
    data: {
      ...normalizeAuthContext(response.data),
      token: normalizeTokenResponse(response.data.token)
    }
  }
}
export const refreshToken = async (data) => {
  const response = await authClient.post('/auth/refresh-token', data, {
    errorFeedback: false
  })
  return { ...response, data: normalizeTokenResponse(response.data) }
}
export const logout = () =>
  authClient.delete('/auth/logout', {
    data: { token: getApeToken().refreshToken },
    errorFeedback: false
  })
