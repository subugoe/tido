<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm annotations"
  >
    <q-list>
      <q-item
        v-for="annotation in filterAnnotations(annotations)"
        :key="annotation.id"
        v-ripple
        clickable
      >
        <q-item-section avatar>
          <q-icon :name="getIcon(annotation.body['x-content-type'])" />
        </q-item-section>
        <q-item-section>
          {{ annotation.body.value }}
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
    return {
      test: [],
    };
  },
  created() {
    this.icons = Icons;
  },
  mounted() {},
  methods: {
    availableTypes() {
      const array = [];
      this.config.annotations.types.forEach((item) => array.push(item.contenttype));
      return array;
    },
    getIcon(contenttype) {
      const result = this.config.annotations.types.filter((item) => item.contenttype === contenttype);
      return Icons.[result[0].icon];
    },

    /**
    * filter the annotation for configured ones
    * TODO: move to computed?
    * @param array annotations
    * @return array annotations without unconfigured ones.
    */
    filterAnnotations(annotations) {
      const arr = [];
      annotations.forEach((annotation) => {
        if (this.availableTypes().filter((item) => item === annotation.body['x-content-type']).length > 0) {
          arr.push(annotation);
        }
      });
      return arr;
    },

    /**
    * get the annotation id/s of the current item
    * @param object annotation
    * @return string
    */
    getAnnotationId(annotation) {
      const split = annotation.target.id.split('/');
      return split[split.length - 1];
    },
  },
};
</script>

<style scoped>
</style>
