<template>
  <q-page-sticky
    :offset="[18, 18]"
    position="bottom-right"
  >
    <q-fab
      color="accent"
      direction="up"
      vertical-actions-align="right"
      :active-icon="fasChevronDown"
      :icon="fasCog"
    >
      <q-fab-action
        color="accent"
        label="Highlight All Annotations in Text Panel"
        label-position="left"
        :disable="selectedAll"
        :icon="fasEye"
        @click="toggleTo(true)"
      />
      <q-fab-action
        color="accent"
        label="Remove All Highlights in Text Panel"
        label-position="left"
        :disable="selectedNone"
        :icon="fasEyeSlash"
        @click="toggleTo(false)"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import {
  fasChevronDown,
  fasCog,
  fasEye,
  fasEyeSlash,
} from '@quasar/extras/fontawesome-v5';

export default {
  name: 'AnnotationOptions',
  props: {
    selectedAll: {
      type: Boolean,
    },
    selectedNone: {
      type: Boolean,
    },
    toggleTo: {
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
