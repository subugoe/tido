<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm annotations"
  >
    <q-list
      class="full-width"
    >
      <q-item
        v-for="annotation in annotations"
        :key="annotation.id"
        v-ripple
        clickable
      >
        <q-item-section avatar>
          <q-icon :name="getIcon(annotation.contenttype)" />
        </q-item-section>
        <q-item-section>
          {{ annotation.description }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <div v-else>
    <p>One does not simply show annotations.</p>
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Annotations',
  props: {
    annotations: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  created() {
    this.icons = Icons;
  },
  mounted() {},
  methods: {
    getIcon(contenttype) {
      const result = this.config.annotations.types.filter((item) => item.contenttype === contenttype);
      return Icons.[result[0].icon];
    },
  },
};
</script>

<style scoped>
</style>
