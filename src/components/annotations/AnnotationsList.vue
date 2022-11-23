<template>
  <q-list class="item-content">
    <q-item
      v-for="annotation in configuredAnnotations"
      :id="'list' + annotation.strippedId"
      :key="annotation.strippedId"
      :class="$q.dark.isActive ? { 'bg-grey-9 active': isActive(annotation) } : { 'bg-grey-4 active': isActive(annotation) }"
      class="q-pa-sm q-pl-xs q-mb-xs"
      :clickable="!isText(annotation)"
      padding="xs"
      @click="isText(annotation) ? ()=>{} : toggle(annotation)"
    >
      <q-item-section avatar class="q-mr-none">
        <AnnotationIcon v-if="!isText(annotation)" :name="getIconName(annotation.body['x-content-type'])" />
      </q-item-section>

      <q-item-section>
        <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
        <span v-html="annotation.body.value" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>

import AnnotationIcon from 'components/annotations/AnnotationIcon.vue';

export default {
  name: 'AnnotationsList',
  components: { AnnotationIcon },
  props: {
    activeAnnotation: {
      type: Object,
      default: () => {},
    },
    configuredAnnotations: {
      type: Array,
      default: () => [],
    },
    toggle: {
      type: Function,
      default: () => null,
    },
    types: Array,
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
    annotationTypesMapping() {
      return this.types.reduce((prev, curr) => {
        prev[curr.name] = curr.annotationType || 'annotation';
        return prev;
      }, {});
    },
  },
  methods: {
    isActive(annotation) {
      return !!this.activeAnnotation[annotation.id];
    },
    isText(annotation) {
      return this.annotationTypesMapping[annotation.body['x-content-type']] === 'text';
    },
    getIconName(typeName) {
      return this.types.find(({ name }) => name === typeName)?.icon || 'biPencilSquare';
    },
  },
};
</script>

<style lang="scss" scoped>
.q-item__section--avatar {
  min-width: 24px;
}

.q-item__section--side {
  padding-right: unset;
}

.q-item {
  min-height: unset;
  user-select: none;
}

.item-content {
  overflow: auto;
}
</style>
