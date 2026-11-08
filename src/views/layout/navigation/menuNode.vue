<template>
  <template v-if="!routerInfo.hidden">
    <!-- 有子菜单的情况 -->
    <el-sub-menu
      v-if="hasVisibleChildren"
      ref="subMenu"
      :index="routerInfo.name"
      class="sub-menu dark:text-slate-300 relative"
    >
      <template #title>
        <div
          v-if="!isCollapse"
          class="menu-node-label"
          :style="{ height: sideHeight }"
        >
          <el-icon v-if="routerInfo.meta?.icon">
            <AppIcon :icon="String(routerInfo.meta?.icon || '')" />
          </el-icon>
          <span class="menu-node-title">{{ menuTitle(routerInfo.meta) }}</span>
        </div>
        <template v-else>
          <el-icon v-if="routerInfo.meta?.icon">
            <AppIcon :icon="String(routerInfo.meta?.icon || '')" />
          </el-icon>
          <span class="menu-node-title">{{ menuTitle(routerInfo.meta) }}</span>
        </template>
      </template>

      <!-- 递归渲染子菜单 -->
      <MenuNode
        v-for="item in visibleChildren"
        :key="item.name"
        :router-info="item"
        :mode="mode"
        :in-popup="inPopup || isCollapse"
      />
    </el-sub-menu>

    <!-- 单个菜单项的情况 -->
    <el-menu-item
      v-else
      :index="routerInfo.name"
      :style="{ height: sideHeight }"
      class="menu-node-item"
    >
      <el-icon v-if="routerInfo.meta?.icon">
        <AppIcon :icon="String(routerInfo.meta?.icon || '')" />
      </el-icon>
      <template v-else>
        {{ isCollapse ? menuTitle(routerInfo.meta)[0] : '' }}
      </template>
      <template #title>
        <span class="menu-node-label">
          <span class="menu-node-title">{{ menuTitle(routerInfo.meta) }}</span>
        </span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.vue';
import { menuTitle } from '@/utils/menuTitle';
import { computed, inject, ref } from 'vue';
import { useAppStore } from '@/pinia';
import { storeToRefs } from 'pinia';
defineOptions({
    name: 'MenuNode'
});
const props = defineProps({
    routerInfo: { type: null, required: true },
    mode: { type: String, required: false, default: 'vertical' },
    inPopup: { type: Boolean, required: false, default: false }
});
const appStore = useAppStore();
const { config } = storeToRefs(appStore);
const sidebarCollapsed = inject('isCollapse', ref(false));
/**
 * 折叠侧栏的飞出菜单仍有完整宽度，应展示文字徽章。
 */
const isCollapse = computed(() => props.mode === 'vertical' && !props.inPopup && sidebarCollapsed.value);
/**
 * 计算菜单高度
 */
const sideHeight = computed(() => {
    return config.value.layoutSideItemHeight + 'px';
});
/**
 * 计算可见的子路由
 */
const visibleChildren = computed(() => {
    return props.routerInfo.children?.filter((item) => !item.hidden) || [];
});
/**
 * 判断是否有可见的子菜单
 */
const hasVisibleChildren = computed(() => {
    return visibleChildren.value.length > 0;
});
</script>

<style lang="scss">
  .sub-menu {
    .el-sub-menu__title {
      height: v-bind('sideHeight') !important;
    }
  }
</style>

<style scoped lang="scss">
  .menu-node-item { position: relative; }

  .menu-node-label {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .menu-node-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu-node-badge {
    margin-left: auto;
    align-self: center;
  }
</style>
