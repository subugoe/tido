<template>
  <span class="metadata-value" v-html="value" />
</template>

<script setup lang="ts">

export interface Props {
  value?: string
}

withDefaults(defineProps<Props>(), {
  value: '',
});
</script>

<style lang="scss" scoped>
.content-urls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}

.url-text {
  display: flex;
  padding-right: 4px;
}

.metadata-value {
  margin-left:10px;
}
</style>
