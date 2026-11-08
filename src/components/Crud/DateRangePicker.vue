<template>
  <el-form-item label="时间范围">
    <el-date-picker
      v-model="range"
      type="datetimerange"
      :clearable="true"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      value-format="YYYY-MM-DD HH:mm:ss"
      :default-time="defaultTime"
      @change="handleChange"
    />
  </el-form-item>
</template>

<script setup>
/**
 * 时间范围选择器，读写查询条件里的 startTime / endTime。
 */
import { ref, watch } from 'vue';
const props = defineProps({
    modelValue: { type: Object, required: false, default: () => ({}) }
});
const emit = defineEmits(["update:modelValue"]);
const defaultTime = [
    new Date(2000, 0, 1, 0, 0, 0),
    new Date(2000, 0, 1, 23, 59, 59)
];
const toRange = (model) => model?.startTime && model?.endTime
    ? [String(model.startTime), String(model.endTime)]
    : null;
const range = ref(toRange(props.modelValue));
watch(() => [props.modelValue?.startTime, props.modelValue?.endTime], () => {
    const next = toRange(props.modelValue);
    if (JSON.stringify(next) !== JSON.stringify(range.value)) {
        range.value = next;
    }
});
/**
 * 把选择结果写回查询条件对象，清空时一并置空两个字段。
 */
const handleChange = (value) => {
    emit('update:modelValue', {
        ...props.modelValue,
        startTime: value?.[0] ?? null,
        endTime: value?.[1] ?? null
    });
};
</script>
