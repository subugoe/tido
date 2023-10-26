<template>
  <q-list class="item-content">
    <q-item
      v-for="annotation in configuredAnnotations"
      :data-annotation-id="annotation.id"
      :key="annotation.id"
      :class="$q.dark.isActive ? { 'bg-grey-7 active': isActive(annotation) } : { 'bg-grey-4 active': isActive(annotation) }"
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
export default {
  name: 'AnnotationsList',
};
</script>

<script setup>
import AnnotationIcon from '@/components/annotations/AnnotationIcon.vue';

import { computed } from 'vue';
// import { useStore } from 'vuex';

const props = defineProps({
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
});

// const store = useStore();

// const config = computed(() => store.getters['config/config']);
const annotationTypesMapping = computed(() => (
  props.types.reduce((prev, curr) => {
    prev[curr.name] = curr.annotationType || 'annotation';
    return prev;
  }, {})
));

function isActive(annotation) {
  return !!props.activeAnnotation[annotation.id];
}
function isText(annotation) {
  return annotationTypesMapping[annotation.body['x-content-type']] === 'text';
}
function getIconName(typeName) {
  return props.types.find(({ name }) => name === typeName)?.icon || 'biPencilSquare';
}
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
  transition-property: background-color;
}

.item-content {
  overflow: auto;
}
</style>
