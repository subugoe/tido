<template>
  <div class="metadata-value">
    <span v-html="value" />
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: () => '',
  },
});
</script>

<style lang="scss" scoped>
.content-urls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}

.content__link {
  display: flex;
  align-items: center;
  border-bottom: 1px var(--q-primary) dotted;
  text-decoration: none;

  @media (prefers-color-scheme: dark) {
    border-color: var(--q-white);
  }
}

.content__link {
  &:focus,
  &:hover,
  &:active {
    border-bottom-style: solid;
  }
}

.url-text {
  display: flex;
  padding-right: 4px;
}

.metadata-value {
  margin-left:10px;
}
</style>
