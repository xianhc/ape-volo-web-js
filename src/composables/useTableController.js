import { computed, getCurrentScope, onScopeDispose, ref, shallowRef } from 'vue'
export function useTableController(options) {
  const pageSizes = options.pageSizes ?? [10, 20, 30, 50, 100]
  const data = ref([])
  const loading = ref(false)
  const error = shallowRef(null)
  const loadFailed = computed(() => error.value !== null)
  const searchVisible = ref(true)
  const selection = ref([])
  const pageIndex = ref(1)
  const pageSize = ref(options.defaultPageSize ?? pageSizes[0] ?? 10)
  const total = ref(0)
  const sortProp = ref(options.defaultSort?.prop ?? 'id')
  const sortOrder = ref(options.defaultSort?.order ?? 'descending')
  let generation = 0
  let disposed = false
  let activeRequest
  let readinessPromise
  /**
   * 等待查询依赖初始化，并共享同一次初始化任务。
   * @returns 查询依赖初始化成功时返回 true，否则返回 false。
   */
  const ensureReady = async () => {
    if (!options.readiness || options.readiness.ready.value) return true
    readinessPromise ??= options.readiness.initialize().finally(() => {
      readinessPromise = undefined
    })
    return readinessPromise
  }
  /**
   * 取得当前操作使用的身份、筛选条件或初始上下文。
   * @param includePagination 是否在当前筛选条件中包含分页与排序。
   * @returns 按要求组合好的筛选、分页和排序条件。
   */
  const currentQuery = (includePagination = true) => ({
    ...options.query.value,
    ...(includePagination
      ? {
          pageIndex: pageIndex.value,
          pageSize: pageSize.value,
          ...(sortProp.value && sortOrder.value
            ? {
                sorting: `${sortProp.value} ${sortOrder.value === 'ascending' ? 'asc' : 'desc'}`
              }
            : {})
        }
      : {})
  })
  /**
   * 重新加载表格列表当前上下文的数据。
   */
  const refresh = async () => {
    if (disposed || options.canLoad?.() === false) return
    activeRequest?.abort()
    const request = new AbortController()
    activeRequest = request
    const currentGeneration = ++generation
    loading.value = true
    error.value = null
    try {
      if (
        !(await ensureReady()) ||
        disposed ||
        currentGeneration !== generation
      )
        return
      let response = await options.list(currentQuery(), {
        errorFeedback: false,
        signal: request.signal
      })
      if (currentGeneration !== generation) return
      const lastPage = Math.max(
        1,
        Math.ceil(response.data.totalCount / pageSize.value)
      )
      // 删除末页最后几条后最多补查一次，避免停留在已不存在的页码。
      if (pageIndex.value > lastPage) {
        pageIndex.value = lastPage
        response = await options.list(currentQuery(), {
          errorFeedback: false,
          signal: request.signal
        })
      }
      if (currentGeneration !== generation) return
      data.value = response.data.items
      total.value = response.data.totalCount
      selection.value = []
    } catch (cause) {
      if (currentGeneration === generation) error.value = cause
    } finally {
      if (currentGeneration === generation) {
        loading.value = false
        activeRequest = undefined
      }
    }
  }
  /**
   * 按当前条件筛选表格列表。
   */
  const search = async () => {
    pageIndex.value = 1
    await refresh()
  }
  /**
   * 替换当前查询对象的字段并保留其响应式引用。
   */
  const replaceQuery = (next) => {
    const target = options.query.value
    Object.keys(target).forEach((key) => Reflect.deleteProperty(target, key))
    Object.assign(target, next)
  }
  /**
   * 恢复表格列表初始筛选、分页和排序条件。
   */
  const resetQuery = async () => {
    replaceQuery(options.defaults())
    pageIndex.value = 1
    sortProp.value = options.defaultSort?.prop ?? 'id'
    sortOrder.value = options.defaultSort?.order ?? 'descending'
    await refresh()
  }
  /**
   * 记录表格当前选中的条目。
   */
  const onSelectionChange = (rows) => {
    selection.value = rows
  }
  /**
   * 更新当前页码并重新查询。
   */
  const onPageChange = async (page) => {
    pageIndex.value = page
    await refresh()
  }
  /**
   * 更新每页数量并从第一页重新查询。
   */
  const onSizeChange = async (size) => {
    pageSize.value = size
    pageIndex.value = 1
    await refresh()
  }
  /**
   * 更新排序条件并重新查询。
   */
  const onSortChange = async ({ prop, order }) => {
    sortProp.value = prop
    sortOrder.value = order ?? ''
    pageIndex.value = 1
    await refresh()
  }
  const pagination = computed(() => ({
    'current-page': pageIndex.value,
    'page-size': pageSize.value,
    total: total.value,
    pageSizes,
    layout: 'total, sizes, prev, pager, next, jumper',
    onCurrentChange: onPageChange,
    onSizeChange
  }))
  if (getCurrentScope())
    onScopeDispose(() => {
      disposed = true
      generation++
      activeRequest?.abort()
    })
  if (options.refreshOnInit !== false) void refresh()
  return {
    data,
    query: options.query,
    loading,
    error,
    loadFailed,
    searchVisible,
    selection,
    pageIndex,
    pageSize,
    total,
    sortProp,
    sortOrder,
    pagination,
    refresh,
    search,
    resetQuery,
    onSelectionChange,
    onSortChange,
    currentQuery
  }
}
