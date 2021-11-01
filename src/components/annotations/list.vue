<template>
  <q-list class="item-content">
    <q-item
      v-for="annotation in configuredAnnotations"
      :id="'list' + annotation.strippedId"
      :key="annotation.strippedId"
      :class="$q.dark.isActive ? { 'bg-grey-9': isActive(annotation) } : { 'bg-grey-4': isActive(annotation) }"
      class="q-pa-sm q-pl-xs q-mb-xs"
      :clickable="!isText(annotation)"
      padding="xs"
      @click="isText(annotation) ? ()=>{} : toggle(annotation)"
    >
      <q-item-section
        v-if="getIcon(annotation.body['x-content-type'])"
        avatar
        class="q-mr-none"
      >
        <q-icon
          :color="$q.dark.isActive ? 'grey-1 text-grey-1' : 'accent'"
          :name="getIcon(annotation.body['x-content-type'])"
          size="16px"
        />
      </q-item-section>

      <q-item-section>
        <AnnotationUrls :content="annotation.body.value" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import AnnotationUrls from '@/components/urls.vue';

export default {
  name: 'AnnotationList',
  components: {
    AnnotationUrls,
  },
  props: {
    activeAnnotation: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      default: () => {},
    },
    getIcon: {
      type: Function,
      default: () => null,
    },
    configuredAnnotations: {
      type: Array,
      default: () => [],
    },
    toggle: {
      type: Function,
      default: () => null,
    },
  },
  computed: {
    annotationTypesMapping() {
      return this.config.annotations.types.reduce((prev, curr) => {
        prev[curr.contenttype] = curr.annotationType || 'annotation';
        return prev;
      }, {});
    },
  },
  methods: {
    isActive(annotation) {
      return !!this.activeAnnotation[annotation.targetId];
    },
    isText(annotation) {
      return this.annotationTypesMapping[annotation.body['x-content-type']] === 'text';
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
  height: 100vh;
  overflow: auto;
  padding: 8px;
  padding-bottom: 72px; // fab icon size + one times the offset of q-page-sticky
}
</style>
