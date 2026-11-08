<template>
  <div class="crud-toolbar-actions">
    <slot name="before" />
    <el-button
      v-if="showCreate && permissions.create"
      v-has-perm="permissions.create"
      type="primary"
      :icon="createIconifyIcon('lucide:plus')"
      :disabled="submitting"
      @click="emit('create')"
    >
      {{ '新增' }}
    </el-button>
    <el-button
      v-if="showRemove && permissions.remove"
      v-has-perm="permissions.remove"
      type="danger"
      :icon="createIconifyIcon('lucide:trash-2')"
      :loading="submitting"
      :disabled="submitting || selectedCount === 0"
      @click="emit('remove')"
    >
      {{ '删除' }}
    </el-button>
    <el-button
      v-if="showExport && permissions.export"
      v-has-perm="permissions.export"
      type="warning"
      :icon="createIconifyIcon('lucide:download')"
      :loading="exporting"
      :disabled="exporting"
      @click="emit('export')"
    >
      {{ '导出' }}
    </el-button>
    <slot />
  </div>
</template>

<script setup>
/**
 * 表格工具栏按钮组件。
 */
import { createIconifyIcon } from '@/components/icons';
defineOptions({ name: 'CrudToolbarActions' });
defineProps({
    permissions: { type: Object, required: false, default: () => ({}) },
    showCreate: { type: Boolean, required: false, default: true },
    showRemove: { type: Boolean, required: false, default: true },
    showExport: { type: Boolean, required: false, default: true },
    selectedCount: { type: Number, required: false, default: 0 },
    submitting: { type: Boolean, required: false, default: false },
    exporting: { type: Boolean, required: false, default: false }
});
const emit = defineEmits(["create", "remove", "export"]);
</script>

<style scoped>
  .crud-toolbar-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--app-space-2);
  }

  .crud-toolbar-actions :deep(.el-button + .el-button) {
    margin-left: 0;
  }
</style>
