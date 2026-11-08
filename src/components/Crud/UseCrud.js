import { ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { useTableController } from '../../composables/useTableController.js'
import { useEntityEditor } from '../../composables/useEntityEditor.js'
import { useMutationAction } from '../../composables/useMutationAction.js'
import { useExportAction } from '../../composables/useExportAction.js'
import { confirmAction } from '../../services/feedback/confirmation.js'
import { provideCrudForm } from './crudContext.js'
export function useCrud(options) {
  const { crudMethod } = options
  const query = options.searchInfo ?? ref({})
  const defaults = cloneDeep(query.value)
  const table = useTableController({
    query,
    defaults: () => cloneDeep(defaults),
    list: async (params, requestOptions) => {
      const response = await crudMethod.list(params, requestOptions)
      const payload = response.data
      return {
        ...response,
        data: Array.isArray(payload)
          ? { items: payload, totalCount: payload.length }
          : payload
      }
    },
    pageSizes: options.pageSizeOptions ?? [1, 10, 20, 30, 50, 100],
    defaultPageSize: (options.pageSizeOptions ?? [1, 10])[1],
    defaultSort: {
      prop: options.sortProp ?? 'id',
      order: options.sortOrder ?? 'descending'
    },
    refreshOnInit: options.refreshOnInit
  })
  const editor = useEntityEditor({
    defaults: options.defaultForm,
    create: async (value) => {
      const response = await crudMethod.add(value)
      ElMessage.success(response.data.message || '新增成功')
    },
    update: async (value) => {
      const response = await crudMethod.edit(value)
      ElMessage.success(response.data.message || '编辑成功')
    },
    saved: table.refresh
  })
  const removal = useMutationAction(async (rows) => {
    if (!rows.length) {
      ElMessage.warning('请先选择要删除的数据')
      return false
    }
    if (
      !(await confirmAction('确认删除选中的' + rows.length + '条数据?', '警告'))
    )
      return false
    const response = await crudMethod.del(rows.map((row) => row.id))
    ElMessage.success(response.data.message || '删除成功')
    await table.refresh()
  })
  const exporting = useExportAction({
    export: (params) => {
      if (!crudMethod.download)
        throw new Error('Export is not available for this list')
      return crudMethod.download(params)
    },
    currentQuery: () => table.currentQuery(false)
  })
  const instance = {
    data: table.data,
    form: editor.form,
    formTitle: computed(() => editor.title.value),
    pageIndex: table.pageIndex,
    pageSize: table.pageSize,
    total: table.total,
    loading: computed(
      () => table.loading.value || editor.saving.value || removal.pending.value
    ),
    error: table.error,
    submitting: computed(() => editor.saving.value || removal.pending.value),
    exporting: exporting.exporting,
    dialogVisible: editor.visible,
    isEdit: editor.editing,
    multipleSelection: table.selection,
    sortProp: table.sortProp,
    sortOrder: table.sortOrder,
    searchToggle: table.searchVisible,
    query,
    pagination: table.pagination,
    refresh: table.refresh,
    toAdd: editor.openCreate,
    toEdit: (row) => editor.openEdit({ ...options.defaultForm(), ...row }),
    save: async (value) => {
      await editor.save(value)
    },
    doDelete: async (row) => {
      await removal.run([row])
    },
    doBatchDelete: async () => {
      await removal.run([...table.selection.value])
    },
    doExport: async () => {
      try {
        await exporting.run()
      } catch {
        /* 请求层反馈错误，导出模块释放状态。 */
      }
    },
    onPageChange: table.pagination.value.onCurrentChange,
    onSizeChange: table.pagination.value.onSizeChange,
    onSelectionChange: table.onSelectionChange,
    resetQuery: table.resetQuery,
    onSortChange: table.onSortChange,
    resetForm: editor.reset,
    closeDialog: editor.close,
    getFormTitle: () => editor.title.value,
    validateAndSave: async (form, value) => {
      await editor.validateAndSave(form, value)
    }
  }
  provideCrudForm({
    form: instance.form,
    dialogVisible: instance.dialogVisible,
    loading: instance.loading,
    closeDialog: instance.closeDialog,
    getFormTitle: instance.getFormTitle,
    validateAndSave: instance.validateAndSave
  })
  return instance
}
