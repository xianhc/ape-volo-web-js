<template>
  <div>
    <div
      class="ape-theme-mode-selector theme-mode-selector-wrap"
      role="radiogroup"
    >
      <div
        v-for="mode in themeModes"
        :key="mode.value"
        class="theme-mode-option preference-choice"
        :class="{ 'is-active': modelValue === mode.value }"
        role="radio"
        :tabindex="disabled ? -1 : 0"
        :aria-checked="modelValue === mode.value"
        :aria-disabled="disabled"
        @click="handleModeChange(mode.value, $event)"
        @keydown.enter.prevent="handleModeChange(mode.value, $event)"
        @keydown.space.prevent="handleModeChange(mode.value, $event)"
      >
        <span class="theme-mode-option__preview preference-preview-frame">
          <el-icon class="theme-mode-option__icon">
            <AppIcon :icon="String(mode.icon || '')" />
          </el-icon>
        </span>
        <span class="theme-mode-option__label">{{ mode.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 主题模式切换组件。
 */
import AppIcon from '@/components/AppIcon.vue';
defineOptions({
    name: 'ThemeModeSelector'
});
const props = defineProps({
    modelValue: { type: String, required: false, default: 'auto' },
    disabled: { type: Boolean, required: false, default: false }
});
const emit = defineEmits(["update:modelValue"]);
const themeModes = [
    {
        value: 'light',
        /**
         * 面向用户显示的标签。
         * @returns 当前语言下对应条目的显示文案。
         */
        get label() {
            return '浅色';
        },
        icon: 'lucide:sun'
    },
    {
        value: 'dark',
        /**
         * 面向用户显示的标签。
         * @returns 当前语言下对应条目的显示文案。
         */
        get label() {
            return '深色';
        },
        icon: 'lucide:moon'
    },
    {
        value: 'auto',
        /**
         * 面向用户显示的标签。
         * @returns 当前语言下对应条目的显示文案。
         */
        get label() {
            return '跟随系统';
        },
        icon: 'lucide:monitor'
    }
];
/**
 * 应用当前布局或选项模式变化。
 * @param mode 准备应用的运行或展示模式。
 * @param event 触发当前交互的事件。
 */
const handleModeChange = (mode, event) => {
    if (!props.disabled)
        emit('update:modelValue', mode, event);
};
</script>

<style scoped>
  .theme-mode-selector-wrap {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
  .theme-mode-option {
    display: grid;
    gap: 10px;
    min-width: 0;
    color: var(--app-text-secondary);
    cursor: pointer;
    text-align: center;
  }
  .theme-mode-option__preview {
    display: grid;
    place-items: center;
    height: 76px;
    border: 1px solid var(--app-border);
    border-radius: var(--preference-radius, 10px);
    background: var(--app-surface);
  }
  .theme-mode-option__icon {
    font-size: 28px;
  }
  .theme-mode-option__label {
    font-size: 13px;
    line-height: 1.5;
  }
  .theme-mode-option.is-active {
    color: var(--el-color-primary);
  }
  .theme-mode-option[aria-disabled='true'] {
    cursor: wait;
    opacity: 0.6;
  }
  .theme-mode-option:focus-visible {
    outline: 2px solid var(--el-color-primary);
    outline-offset: 4px;
    border-radius: 10px;
  }
</style>
