<template>
  <q-list>
    <q-item
      v-for="annotation in hotAnnotations"
      :id="'list' + annotation.strippedId"
      :key="annotation.strippedId"
      class="q-pa-sm q-pl-xs q-mb-xs"
      clickable
      padding="xs"
      @click="toggle(annotation); statusCheck();"
    >
      <q-item-section
        avatar
        class="q-mr-none"
      >
        <q-icon
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
    getIcon: {
      type: Function,
      default: () => null,
    },
    hotAnnotations: {
      type: Array,
      default: () => [],
    },
    toggle: {
      type: Function,
      default: () => null,
    },
    statusCheck: {
      type: Function,
      default: () => null,
    },
  },
};
</script>

<style>
.q-item__section--avatar {
  min-width: 24px;
}

.q-item__section--side {
  padding-right: unset;
}

.q-item {
  min-height: unset;
}
</style>
