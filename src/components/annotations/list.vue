<template>
  <q-list class="item-content">
    <q-item
      v-for="annotation in renderedAnnotations"
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
    currentAnnotations: {
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
  data() {
    return {
      currentTypes: [],
    };
  },
  computed: {
    renderedAnnotations() {
      return this.currentAnnotations.filter((current) => this.currentTypes.includes(current.body['x-content-type']));
    },
  },
  mounted() {
    this.currentTypes = this.getCurrentTypes();

    this.$root.$on('update-item', () => {
      this.currentTypes = this.getCurrentTypes();
    });

    this.$root.$on('update-toggles', (model) => {
      this.currentTypes = model;
    });
  },
  methods: {
    getCurrentTypes() {
      return [...new Set(this.currentAnnotations.map((annotation) => annotation.body['x-content-type']))];
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
}

.item-content {
  height: 100vh;
  overflow: auto;
  padding: 8px;
  padding-bottom: 72px; // fab icon size + one times the offset of q-page-sticky
}
</style>
