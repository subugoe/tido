<template>
  <q-list class="item-content">
    <q-item
      v-for="annotation in configuredAnnotations"
      :id="'list' + annotation.strippedId"
      :key="annotation.strippedId"
      :class="$q.dark.isActive ? { 'bg-grey-9': isActive(annotation) } : { 'bg-grey-4': isActive(annotation) }"
      class="q-pa-sm q-pl-xs q-mb-xs"
      clickable
      padding="xs"
      @click="toggle(annotation)"
    >
      <q-item-section
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
  methods: {
    isActive(annotation) {
      return !!this.activeAnnotation[annotation.targetId];
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
