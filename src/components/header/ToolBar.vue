<template>
  <div class="text-body1 text-weight-medium text-center q-pb-xs q-pt-xs">
    {{ capitalizedHeading }}
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
});

const capitalizedHeading = computed(() => t(props.heading).toUpperCase());
</script>

<style lang="scss" scoped>
.panel__title {
  color: var(--q-primary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
}
</style>
