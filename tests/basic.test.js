import { getJobActions, getJobDetails, getJobSchedule, getJobState, getJobWarning } from '../src/views/system/job/jobState.js'
import { toJobRequest } from '../src/api/system/jobAdapter.js'
import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import { AxiosError, AxiosHeaders } from 'axios'
import { effectScope, ref } from 'vue'
import {
  createTokenRefresher,
  SessionChangedError,
  SessionExpiredError
} from '../src/services/session/tokenRefresh.js'
import { createHttpClient } from '../src/services/http/client.js'
import { useTableController } from '../src/composables/useTableController.js'
import { useEntityEditor } from '../src/composables/useEntityEditor.js'
import { loadPasswordPublicKey, encrypt } from '../src/utils/rsaEncrypt.js'
import {
  importPasswordPublicKey,
  encryptWithPublicKey
} from '../src/utils/rsaCrypto.js'
import {
  buildDepartmentTree,
  filterDepartmentTree
} from '../src/api/organization/department/adapter.js'
import { getMenuNavigationTarget } from '../src/services/navigation/menuNavigation.js'
import { MenuType } from '../src/enums/MenuType.js'
import {
  createUserDraft,
  toUserRequest
} from '../src/api/identity/userAdapter.js'
import { toRoleRequest } from '../src/api/identity/roleAdapter.js'
import { toMenuRequest } from '../src/api/identity/menuAdapter.js'
import { isSessionIdentityChange } from '../src/services/session/tokenStorage.js'
test('jobActionsFollowRuntimeStateWhenConfigurationDiffers', () => {
  const expected = { 0: ['start'], 1: ['pause', 'stop'], 2: ['resume', 'stop'], 3: ['restart', 'stop'], 4: ['restart', 'stop'], 5: ['stop'] }
  for (const enabled of [false, true]) {
    for (const triggerState of [0, 1, 2, 3, 4, 5]) {
      assert.deepEqual(getJobActions({ enabled, triggerState }), expected[triggerState], 'Actions must follow the actual scheduler state')
    }
  }
  assert.deepEqual(getJobActions({ enabled: true }), [])
  assert.deepEqual(getJobActions({ enabled: true, triggerState: 99 }), [])
  assert.equal(getJobWarning({ enabled: false, triggerState: 99 }), '')
  assert.equal(getJobState(undefined).label, '状态未知')
  assert.ok(getJobWarning({ enabled: true, triggerState: 0 }))
  assert.ok(getJobWarning({ enabled: false, triggerState: 2 }))
})

test('jobDetailsOmitUnsetFieldsAndDescribeSimpleSchedules', () => {
  const groups = getJobDetails({ assemblyName: 'Test', className: 'Example', startTime: '', endTime: undefined, principal: '  ' })
  assert.deepEqual(groups.flatMap(group => group.fields.map(field => field.label)), ['程序集', '执行类'])
  const withWindow = getJobDetails({ startTime: '2026-11-07 09:00:00' })
  assert.deepEqual(withWindow[0].fields, [{ label: '开始时间', value: '2026-11-07 09:00:00' }])
  assert.equal(getJobSchedule({ triggerType: 2, intervalSecond: 60, cycleRunTimes: 0 }).repeat, '持续触发')
  assert.equal(getJobSchedule({ triggerType: 2, intervalSecond: 60, cycleRunTimes: 10 }).repeat, '共 10 次')
  assert.equal(getJobSchedule({ triggerType: 1, cron: '0 * * * * ?' }).rule, '0 * * * * ?')
})

test('jobWritesExcludeRuntimeAndAuditFieldsAndClearInactiveMode', () => {
  const source = { id: '9223372036854775807', jobName: 'Example', triggerType: 2, cron: 'old', intervalSecond: 60, cycleRunTimes: 0, triggerState: 2, creatorId: '3', creationTime: '2026-11-07', enabled: true }
  const before = JSON.stringify(source)
  const payload = toJobRequest(source)
  assert.equal(payload.id, source.id)
  assert.equal(payload.cron, null)
  assert.equal(payload.cycleRunTimes, 0)
  assert.equal('triggerState' in payload, false)
  assert.equal('creatorId' in payload, false)
  assert.equal('creationTime' in payload, false)
  assert.equal(payload.startTime, null)
  assert.equal(payload.endTime, null)
  assert.equal(JSON.stringify(source), before)
  const cron = toJobRequest({ ...source, triggerType: 1, cron: '0 * * * * ?' })
  assert.equal(cron.intervalSecond, null)
  assert.equal(cron.cycleRunTimes, null)
})

test('refreshRejectionEndsSessionWhileTemporaryFailuresKeepCredentials', async () => {
  for (const proactive of [true, false]) {
    for (const status of [400, 401, 403, 429, 500, undefined]) {
      let token = {
        sessionId: 'first',
        accessToken: 'access',
        refreshToken: 'refresh',
        tokenType: 'Bearer',
        expires: proactive ? 0 : 2000,
        refreshTokenExpires: 3000
      }
      let expired = 0
      let errors = 0
      let requests = 0
      const refresh = createTokenRefresher({
        read: () => token,
        save: () => assert.fail('Rejected refresh must not save credentials'),
        request: async () => {
          throw new AxiosError(
            'Refresh failed',
            undefined,
            undefined,
            undefined,
            status === undefined
              ? undefined
              : {
                  status,
                  statusText: 'Rejected',
                  headers: {},
                  config: { headers: new AxiosHeaders() },
                  data: {
                    isSuccess: false,
                    status,
                    message: 'token验证失败，请重新登录！'
                  }
                }
          )
        },
        withLock: (work) => work(),
        now: () => 1000
      })
      const client = createHttpClient({
        config: {
          adapter: async (config) => {
            requests++
            throw new AxiosError('Unauthorized', undefined, config, undefined, {
              status: 401,
              statusText: 'Unauthorized',
              data: {},
              headers: {},
              config
            })
          }
        },
        session: {
          read: () => token,
          refresh,
          invalidate: () => {
            token = {
              ...token,
              sessionId: '',
              accessToken: '',
              refreshToken: ''
            }
          }
        },
        feedback: {
          expired: () => {
            expired++
          },
          error: () => {
            errors++
          },
          forbidden: () => assert.fail('Refresh must use session expiry')
        },
        now: () => 1000
      })
      await assert.rejects(client.get('/users', { errorFeedback: false }))
      const rejected = status === 400 || status === 401 || status === 403
      assert.equal(
        expired,
        rejected ? 1 : 0,
        `proactive=${proactive}, status=${status}`
      )
      assert.equal(token.sessionId, rejected ? '' : 'first')
      assert.equal(errors, 0)
      assert.equal(requests, proactive ? 0 : 1)
    }
  }
})
test('crossTabSessionChangesClearPagesWhileTokenRotationKeepsThem', () => {
  const key = 'ape-volo-admin-token'
  const oldValue = JSON.stringify({ sessionId: 'first', accessToken: 'old' })
  assert.equal(
    isSessionIdentityChange({
      key,
      oldValue,
      newValue: JSON.stringify({ sessionId: 'second' })
    }),
    true
  )
  assert.equal(isSessionIdentityChange({ key, oldValue, newValue: null }), true)
  assert.equal(
    isSessionIdentityChange({ key, oldValue: null, newValue: oldValue }),
    true
  )
  assert.equal(
    isSessionIdentityChange({
      key,
      oldValue,
      newValue: JSON.stringify({ sessionId: 'first', accessToken: 'new' })
    }),
    false
  )
  assert.equal(
    isSessionIdentityChange({ key: 'preferences', oldValue, newValue: null }),
    false
  )
  assert.equal(
    isSessionIdentityChange({ key: null, oldValue: null, newValue: null }),
    true
  )
  assert.equal(
    isSessionIdentityChange({ key, oldValue, newValue: 'invalid' }),
    true
  )
})
test('departmentTreePreservesHierarchyAndSource', () => {
  const departments = [
    { id: '9007199254740993', parentId: '1', name: 'Child', creationTime: '' },
    { id: '1', parentId: null, name: 'Root', creationTime: '' },
    {
      id: '3',
      parentId: '9007199254740993',
      name: 'Grandchild',
      creationTime: ''
    }
  ]
  const original = structuredClone(departments)
  const tree = buildDepartmentTree(departments)
  assert.equal(tree.length, 1)
  assert.equal(tree[0].id, '1')
  assert.equal(tree[0].children[0].id, '9007199254740993')
  assert.equal(tree[0].children[0].children[0].id, '3')
  assert.deepEqual(departments, original)
})
test('departmentFiltersFindNestedMatchesAndPreserveAncestorsAndSource', () => {
  const tree = buildDepartmentTree([
    {
      id: '1',
      parentId: null,
      name: 'Head Office',
      enabled: false,
      creationTime: '2025-01-01 00:00:00'
    },
    {
      id: '9007199254740993',
      parentId: '1',
      name: 'Engineering',
      enabled: true,
      creationTime: '2026-10-01 00:00:00'
    },
    {
      id: '3',
      parentId: '1',
      name: 'Sales',
      enabled: true,
      creationTime: '2025-01-01 00:00:00'
    }
  ])
  const original = structuredClone(tree)
  const result = filterDepartmentTree(tree, {
    name: ' ENGINEERING ',
    enabled: true,
    startTime: '2026-01-01 00:00:00',
    endTime: '2026-11-01 00:00:00'
  })
  assert.equal(result[0].id, '1')
  assert.deepEqual(
    result[0].children?.map((node) => node.id),
    ['9007199254740993']
  )
  assert.deepEqual(filterDepartmentTree(tree, { name: 'Missing' }), [])
  assert.deepEqual(
    filterDepartmentTree(tree, { enabled: false })[0].children,
    []
  )
  assert.deepEqual(tree, original)
})
test('departmentSortingKeepsParentChildRelationshipsAndLongIds', () => {
  const tree = buildDepartmentTree([
    { id: '1', parentId: null, name: 'Root', sort: 2, creationTime: '' },
    { id: '2', parentId: null, name: 'Second', sort: 1, creationTime: '' },
    {
      id: '9007199254740993',
      parentId: '1',
      name: 'Later',
      sort: 2,
      creationTime: ''
    },
    {
      id: '9007199254740992',
      parentId: '1',
      name: 'Earlier',
      sort: 1,
      creationTime: ''
    }
  ])
  const ascending = filterDepartmentTree(tree, { sorting: 'sort asc' })
  assert.deepEqual(
    ascending.map((node) => node.id),
    ['2', '1']
  )
  assert.deepEqual(
    ascending[1].children?.map((node) => node.id),
    ['9007199254740992', '9007199254740993']
  )
  assert.deepEqual(
    filterDepartmentTree(tree, { sorting: 'id desc' })[1].children?.map(
      (node) => node.id
    ),
    ['9007199254740993', '9007199254740992']
  )
})
test('externalMenuAllowsHttpUrlsAndRejectsUnsafeSchemes', () => {
  for (const component of [
    'javascript:void 0',
    'data:text/html,test',
    '//example.com'
  ]) {
    assert.equal(
      getMenuNavigationTarget({ menuType: MenuType.ExternalLink, component }),
      null
    )
  }
  assert.equal(
    getMenuNavigationTarget({
      menuType: MenuType.ExternalLink,
      component: 'https://example.com/docs'
    }),
    'https://example.com/docs'
  )
})
test('userWritePayloadExcludesAuditFieldsAndCopiesRelations', () => {
  const draft = {
    ...createUserDraft(),
    id: '9007199254740993',
    dept: { id: '2', name: 'Engineering' },
    roles: [{ id: '3', name: 'Operator' }],
    positions: [{ id: '4', name: 'Engineer' }],
    creatorId: '999',
    isDeleted: true
  }
  const request = toUserRequest(draft)
  assert.equal(request.id, '9007199254740993')
  assert.deepEqual(request.dept, { id: '2' })
  assert.equal('creatorId' in request, false)
  assert.equal('isDeleted' in request, false)
  request.roles[0].id = '5'
  assert.equal(draft.roles[0].id, '3')
  assert.throws(() => toUserRequest(createUserDraft()), /请选择部门/)
})
test('roleWritePayloadOnlySubmitsCustomDepartmentIds', () => {
  const draft = {
    id: '1',
    name: 'Operator',
    authCode: 'operator',
    dataScopeType: 5,
    deptIdArray: ['2'],
    menuList: [{ id: '999' }],
    creatorId: '888'
  }
  const request = toRoleRequest(draft)
  assert.deepEqual(request.deptIdArray, ['2'])
  assert.notEqual(request.deptIdArray, draft.deptIdArray)
  assert.equal('menuList' in request, false)
  assert.equal('creatorId' in request, false)
  assert.deepEqual(
    toRoleRequest({ ...draft, dataScopeType: 2 }).deptIdArray,
    []
  )
})
test('linkMenuPayloadCannotCarryInterfacePermissionCodes', () => {
  const draft = {
    id: '1',
    title: 'Link',
    menuType: MenuType.ExternalLink,
    sort: 1,
    parentId: null,
    keepAlive: false,
    enabled: true,
    hidden: false,
    authCode: 'sys:user:del',
    creatorId: '999',
    children: []
  }
  const request = toMenuRequest(draft)
  assert.equal(request.authCode, undefined)
  assert.equal('creatorId' in request, false)
  assert.equal('children' in request, false)
  assert.equal(
    toMenuRequest({ ...draft, menuType: MenuType.Button }).authCode,
    'sys:user:del'
  )
})

const tokenPair = (changes = {}) => ({
  sessionId: 'session-a',
  accessToken: 'old-access',
  refreshToken: 'old-refresh',
  tokenType: 'Bearer',
  expires: 200,
  refreshTokenExpires: 1000,
  ...changes
})

test('refreshRequestsInOnePageShareOnePromiseAndOneWrite', async () => {
  const response = Promise.withResolvers()
  let requests = 0
  const saved = []
  const refresh = createTokenRefresher({
    read: () => tokenPair(),
    save: (token) => saved.push(token),
    request: () => {
      requests++
      return response.promise
    },
    withLock: (work) => work(),
    now: () => 100
  })
  const first = refresh()
  const second = refresh()
  assert.equal(first, second)
  assert.equal(requests, 1)
  response.resolve(
    tokenPair({ accessToken: 'new-access', refreshToken: 'new-refresh' })
  )
  await Promise.all([first, second])
  assert.equal(saved.length, 1)
})

test('refreshRechecksRotatedTokensInsideCrossTabLock', async () => {
  let current = tokenPair()
  let requests = 0
  const refresh = createTokenRefresher({
    read: () => current,
    save: () => assert.fail('Another tab already saved the token'),
    request: async () => {
      requests++
      return tokenPair()
    },
    withLock: async (work) => {
      current = tokenPair({
        accessToken: 'rotated',
        refreshToken: 'rotated-refresh'
      })
      await work()
    },
    now: () => 100
  })
  await refresh()
  assert.equal(requests, 0)
})

test('refreshCannotSaveAnOldAccountResponseAfterSessionSwitch', async () => {
  const response = Promise.withResolvers()
  let current = tokenPair()
  const refresh = createTokenRefresher({
    read: () => current,
    save: () => assert.fail('Stale session must not write'),
    request: () => response.promise,
    withLock: (work) => work(),
    now: () => 100
  })
  const pending = refresh()
  current = tokenPair({ sessionId: 'session-b' })
  response.resolve(
    tokenPair({ accessToken: 'new-access', refreshToken: 'new-refresh' })
  )
  await assert.rejects(pending, SessionChangedError)
})

test('invalidRefreshResponsesExpireTheSessionWithoutSaving', async () => {
  for (const changes of [
    { sessionId: 'wrong' },
    { accessToken: '' },
    { expires: NaN },
    { expires: 50 }
  ]) {
    const refresh = createTokenRefresher({
      read: () => tokenPair(),
      save: () => assert.fail('Invalid token must not write'),
      request: async () => tokenPair(changes),
      withLock: (work) => work(),
      now: () => 100
    })
    await assert.rejects(refresh(), SessionExpiredError)
  }
})

function httpFixture(adapter, refresh = async () => {}) {
  let current = tokenPair()
  const events = { expired: 0, forbidden: 0, errors: [], invalidated: [] }
  const client = createHttpClient({
    config: { adapter },
    now: () => 100,
    session: {
      read: () => current,
      refresh: (failed) =>
        refresh(failed, (token) => {
          current = token
        }),
      invalidate: (sessionId) => events.invalidated.push(sessionId)
    },
    feedback: {
      expired: () => events.expired++,
      forbidden: () => events.forbidden++,
      error: (error) => events.errors.push(error)
    }
  })
  return {
    client,
    events,
    setToken: (token) => {
      current = token
    }
  }
}

const unauthorized = (config) =>
  new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config,
    data: {}
  })

test('http401RefreshesAndReplaysOnlyOnce', async () => {
  let requests = 0
  let refreshes = 0
  const fixture = httpFixture(
    async (config) => {
      requests++
      throw unauthorized(config)
    },
    async (failed, save) => {
      refreshes++
      assert.equal(failed, 'old-access')
      save(tokenPair({ accessToken: 'new-access' }))
    }
  )
  await assert.rejects(
    fixture.client.get('/test'),
    (error) => error.response.status === 401
  )
  assert.equal(requests, 2)
  assert.equal(refreshes, 1)
  assert.deepEqual(fixture.events.invalidated, ['session-a'])
  assert.equal(fixture.events.expired, 1)
})

test('temporaryRefreshFailuresKeepCredentialsAndHonorLocalFeedback', async () => {
  for (const status of [429, 503, undefined]) {
    const failure = new AxiosError(
      'Temporary failure',
      'ECONNABORTED',
      undefined,
      undefined,
      status ? { status } : undefined
    )
    const fixture = httpFixture(
      () => assert.fail('Expired token must refresh before transport'),
      async () => {
        throw failure
      }
    )
    fixture.setToken(tokenPair({ expires: 50 }))
    await assert.rejects(
      fixture.client.get('/test', { errorFeedback: false }),
      (error) => error.originalError === failure
    )
    assert.deepEqual(fixture.events.invalidated, [])
    assert.equal(fixture.events.expired, 0)
    assert.deepEqual(fixture.events.errors, [])
  }
})

test('responsesFromAnOldSessionCannotReachTheNewAccount', async () => {
  const started = Promise.withResolvers()
  const response = Promise.withResolvers()
  const fixture = httpFixture((config) => {
    started.resolve(config)
    return response.promise
  })
  const pending = fixture.client.get('/test')
  const config = await started.promise
  fixture.setToken(tokenPair({ sessionId: 'session-b' }))
  response.resolve({
    status: 200,
    config,
    headers: {},
    data: { secret: 'old-account' }
  })
  await assert.rejects(pending, SessionChangedError)
  assert.deepEqual(fixture.events.invalidated, [])
})

test('tableCancelsSupersededQueriesAndRejectsLateResponses', async () => {
  const calls = []
  const scope = effectScope()
  const table = scope.run(() =>
    useTableController({
      query: ref({ name: '' }),
      defaults: () => ({ name: '' }),
      refreshOnInit: false,
      list: (query, options) => {
        const response = Promise.withResolvers()
        calls.push({ query, options, response })
        return response.promise
      }
    })
  )
  const first = table.refresh()
  await Promise.resolve()
  const second = table.refresh()
  await Promise.resolve()
  assert.equal(calls[0].options.signal.aborted, true)
  calls[1].response.resolve({ data: { items: [{ id: 'new' }], totalCount: 1 } })
  await second
  calls[0].response.resolve({ data: { items: [{ id: 'old' }], totalCount: 1 } })
  await first
  assert.equal(table.data.value[0].id, 'new')
  const third = table.refresh()
  await Promise.resolve()
  scope.stop()
  assert.equal(calls[2].options.signal.aborted, true)
  calls[2].response.resolve({
    data: { items: [{ id: 'unmounted' }], totalCount: 1 }
  })
  await third
  assert.equal(table.data.value[0].id, 'new')
})

test('tableRepairsAnOutOfRangePageWithOnlyOneAdditionalQuery', async () => {
  const pages = []
  const table = useTableController({
    query: ref({}),
    defaults: () => ({}),
    refreshOnInit: false,
    list: async (query) => {
      pages.push(query.pageIndex)
      return { data: { items: [], totalCount: 11 } }
    }
  })
  table.pageIndex.value = 99
  await table.refresh()
  assert.deepEqual(pages, [99, 2])
  assert.equal(table.pageIndex.value, 2)
})

test('editorDraftsAndSubmittedValuesDoNotMutateTheSourceRow', async () => {
  const source = { id: '1', roles: [{ id: '2' }] }
  const editor = useEntityEditor({
    defaults: () => ({ roles: [] }),
    create: async () => {},
    update: async (value) => {
      value.roles[0].id = 'server-transform'
    },
    saved: async () => {}
  })
  editor.openEdit(source)
  editor.form.value.roles[0].id = 'draft-change'
  await editor.save()
  assert.equal(source.roles[0].id, '2')
  assert.equal(editor.form.value.roles[0].id, 'draft-change')
})

test('passwordPublicKeyIsFetchedWithoutCacheForEveryOperation', async (context) => {
  const pem = fs.readFileSync(
    new URL('../public/keys/password-public.pem', import.meta.url),
    'utf8'
  )
  const calls = []
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options })
    return new Response(pem)
  })
  const first = await loadPasswordPublicKey('/console/')
  const second = await loadPasswordPublicKey('/console/')
  assert.equal(first.algorithm.modulusLength, 4096)
  assert.notEqual(first, second)
  assert.deepEqual(
    calls,
    [1, 2].map(() => ({
      url: '/console/keys/password-public.pem',
      options: { cache: 'no-store' }
    }))
  )
  const ciphertext = await encrypt('password', first)
  assert.equal(Buffer.from(ciphertext, 'base64').length, 512)
  await assert.rejects(encryptWithPublicKey('密'.repeat(149), first), /446/)
})

test('publicKeyLoadAndImportErrorsStopPasswordOperations', async (context) => {
  context.mock.method(
    globalThis,
    'fetch',
    async () => new Response('missing', { status: 404 })
  )
  await assert.rejects(loadPasswordPublicKey('/'), /HTTP 404/)
  await assert.rejects(importPasswordPublicKey(''), /格式错误/)
  await assert.rejects(importPasswordPublicKey('invalid pem'))
  const smallKey = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  )
  const encoded = Buffer.from(
    await crypto.subtle.exportKey('spki', smallKey.publicKey)
  ).toString('base64')
  await assert.rejects(
    importPasswordPublicKey(
      `-----BEGIN PUBLIC KEY-----\n${encoded}\n-----END PUBLIC KEY-----`
    ),
    /4096/
  )
})
