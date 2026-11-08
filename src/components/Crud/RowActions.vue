<template>
  <div ref="root" class="table-row-actions">
    <slot name="before" />
    <el-button
      v-if="row && edit && permissions.edit"
      v-has-perm="permissions.edit"
      type="primary"
      link
      :icon="createIconifyIcon('lucide:square-pen')"
      :disabled="busy || disableEdit"
      @click="edit(row)"
    >
      {{ '编辑' }}
    </el-button>
    <el-popconfirm
      v-if="row && remove && permissions.remove"
      :title="removeTitle"
      :confirm-button-text="'确定'"
      :cancel-button-text="'取消'"
      @confirm="remove(row)"
    >
      <template #reference>
        <el-button
          v-has-perm="permissions.remove"
          type="danger"
          link
          :icon="createIconifyIcon('lucide:trash-2')"
          :disabled="busy || disableRemove"
        >
          {{ '删除' }}
        </el-button>
      </template>
    </el-popconfirm>
    <slot />
    <slot name="after" />
  </div>
</template>
<script setup>
/**
 * 表格行操作按钮组件。
 */
import { createIconifyIcon } from '@/components/icons';
import { inject, ref, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick } from 'vue';
import { computed } from 'vue';
import { rowActionMeasurementsKey } from './tableContext';
const props = defineProps({
    row: { type: null, required: false, default: undefined },
    label: { type: String, required: false, default: '' },
    permissions: { type: Object, required: false, default: () => ({}) },
    edit: { type: Function, required: false, default: undefined },
    remove: { type: Function, required: false, default: undefined },
    busy: { type: Boolean, required: false, default: false },
    disableEdit: { type: Boolean, required: false, default: false },
    disableRemove: { type: Boolean, required: false, default: false }
});
const removeTitle = computed(() => props.label
    ? '确认删除？'
    : '确认删除该记录？');
const root = ref();
const measurements = inject(rowActionMeasurementsKey, undefined);
const id = Symbol('row');
let observer;
/**
 * 测量当前元素的实际展示宽度。
 */
const measure = () => {
    if (root.value?.isConnected && root.value.getClientRects().length) {
        measurements?.report(id, Math.ceil(root.value.getBoundingClientRect().width) + 24);
    }
};
/**
 * 注册表格所需的状态变化监听。
 */
function observe() {
    observer?.disconnect();
    if (root.value && measurements) {
        observer = new ResizeObserver(measure);
        observer.observe(root.value);
        measure();
    }
}
onMounted(observe);
onActivated(async () => {
    await nextTick();
    observe();
});
onDeactivated(() => {
    observer?.disconnect();
    measurements?.remove(id);
});
onBeforeUnmount(() => {
    observer?.disconnect();
    measurements?.remove(id);
});
</script>
<style scoped>
  .table-row-actions {
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 8px;
    width: max-content;
    white-space: nowrap;
  }
  .table-row-actions > :deep(*) {
    flex: none;
  }
  .table-row-actions :deep(.el-button + .el-button) {
    margin-left: 0;
  }
</style>
