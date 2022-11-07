<template>
  <q-icon
    v-if="name"
    :color="isDarkMode ? 'grey-1 text-grey-1' : 'primary'"
    :name="name"
    size="16px"
  />
</template>
<script>
import { icon } from '@/utils/icon';
import { Dark } from 'quasar';

export default {
  name: 'AnnotationIcon',
  props: {
    name: String
  },
  computed: {
    show() {
      return !!(this.types.find((type) => type.name === this.contentType)?.icon);
    },
    isDarkMode() {
      return Dark.isActive;
    },
    name() {
      return icon(this.name);
    },
  },
};
</script>

<style scoped>

</style>
