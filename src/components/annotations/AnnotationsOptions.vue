<template>
  <div class="fab-container">
    <q-fab
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
      direction="up"
      vertical-actions-align="right"
      :active-icon="fasChevronDown"
      :icon="fasCog"
    >
      <q-fab-action
        :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
        :label="$t('highlight_all_annotations')"
        label-position="left"
        :disable="selectedAll"
        :icon="fasEye"
        @click="onHighlightAll"
      />
      <q-fab-action
        :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
        :label="$t('highlight_no_annotations')"
        label-position="left"
        :disable="selectedNone"
        :icon="fasEyeSlash"
        @click="onHighlightNone"
      />
    </q-fab>
  </div>
</template>

<script>
import {
  fasChevronDown,
  fasCog,
  fasEye,
  fasEyeSlash,
} from '@quasar/extras/fontawesome-v5';

export default {
  name: 'AnnotationsOptions',
  props: {
    selectedAll: {
      type: Boolean,
    },
    selectedNone: {
      type: Boolean,
    },
    onHighlightAll: {
      type: Function,
      default: () => null,
    },
    onHighlightNone: {
      type: Function,
      default: () => null,
    },
  },
  created() {
    this.fasChevronDown = fasChevronDown;
    this.fasCog = fasCog;
    this.fasEye = fasEye;
    this.fasEyeSlash = fasEyeSlash;
  },
};
</script>

<style lang="scss" scoped>
  .fab-container {
    bottom: 16px;
    position: absolute;
    right: 16px;
  }
</style>
