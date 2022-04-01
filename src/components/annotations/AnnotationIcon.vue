<template>
  <q-icon
    v-if="show"
    :color="isDarkMode ? 'grey-1 text-grey-1' : 'accent'"
    :name="name"
    size="16px"
  />
</template>
<script>
import * as Icons from '@quasar/extras/fontawesome-v5';
import { Dark } from 'quasar';

export default {
  name: 'AnnotationIcon',
  props: {
    contentType: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    show() {
      return !!(this.types.find((type) => type.contenttype === this.contentType)?.icon);
    },
    types() {
      return this.$store.getters['config/config'].annotations.types;
    },
    isDarkMode() {
      return Dark.isActive;
    },
    name() {
      return Icons[this.types.filter(
        (annotation) => annotation.contenttype === this.contentType,
      )[0].icon];
    },
  },
};
</script>

<style scoped>

</style>
