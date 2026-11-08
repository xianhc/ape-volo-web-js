import request from '../utils/request.js'
import { normalizeAuthContext } from './authAdapter.js'
export { login, logout, refreshToken } from './authClient.js'
export async function getUserInfo() {
  const response = await request.get('/auth/info')
  return { ...response, data: normalizeAuthContext(response.data) }
}
