<template>
  <div>
    <h3 class="q-mb-md q-mt-none q-pl-xs text-body1 text-uppercase text-weight-medium">
      Toggle annotations by type
    </h3>

    <q-toggle
      v-for="(type, index) in editorialTypes"
      :key="index"
      v-model="model"
      :color="$q.dark.isActive ? 'grey-8' : 'accent'"
      :disable="typeDisabled(type.contenttype)"
      :icon="icons[type.icon]"
      :label="type.label"
      :val="type.contenttype"
      class="q-mr-md q-mb-md q-pa-sm q-pl-xs text-uppercase"
      dense
      size="md"
      toggle-order="tf"
    />

    <q-separator />
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

export default {
  name: 'AnnotationToggles',
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    currentAnnotations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      icons: {},
      model: [],
    };
  },
  computed: {
    editorialTypes() {
      return this.config.annotations.types.filter((type) => type.genus === 'editorial');
    },
  },
  watch: {
    model() {
      this.$root.$emit('update-toggles', this.model);
    },
  },
  created() {
    this.icons = Icons;
  },
  mounted() {
    this.model = this.activeTypes();

    this.$root.$on('update-item', () => {
      this.model = this.activeTypes();
    });
  },
  methods: {
    activeTypes() {
      return [...new Set(this.currentAnnotations.map((annotation) => annotation.body['x-content-type']))];
    },
    typeDisabled(type) {
      return !this.activeTypes().includes(type);
    },
  },
};
</script>
