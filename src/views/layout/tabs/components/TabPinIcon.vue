<template>
  <AppIcon :icon="slashed ? 'lucide:pin-off' : 'lucide:pin'" />
</template>
<script setup>
/**
 * 页签固定图标组件。
 */
import AppIcon from '@/components/AppIcon.vue';
defineProps({
    slashed: { type: Boolean, required: false, default: false }
});
</script>
