/**
 * 将令牌有效期统一为数值。
 */
export function normalizeTokenResponse(dto) {
  return {
    ...dto,
    expires: Number(dto.expires),
    refreshTokenExpires: Number(dto.refreshTokenExpires)
  }
}

/**
 * 校验登录用户主键，并统一用户字段、部门信息和权限列表。
 */
export function normalizeAuthContext(dto) {
  if (!dto?.user || dto.user.id === null || dto.user.id === undefined) {
    throw new Error('Invalid authentication response')
  }
  const user = dto.user
  const department = user.dept ?? user.department
  const roleCodes = dto.roleCodes ?? []
  const authCodes = dto.authCodes ?? []
  return {
    roleCodes,
    authCodes,
    user: {
      id: String(user.id),
      userName: user.userName ?? user.username ?? '',
      nickName: user.nickName ?? user.nickname ?? '',
      headerImg: user.headerImg ?? user.avatar ?? '',
      genderCode: user.genderCode ?? 0,
      email: user.email ?? '',
      phone: user.phone ?? '',
      dept: department
        ? {
            ...(department.id == null ? {} : { id: String(department.id) }),
            name: department.name
          }
        : {},
      authority: user.authority ?? {},
      roleCodes,
      authCodes
    }
  }
}
