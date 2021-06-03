<template>
  <div>
    <h3 class="q-mb-md q-mt-none q-pl-xs text-body1 text-uppercase text-weight-medium">
      Toggle annotations by type
    </h3>

    <q-toggle
      v-for="(type, index) in config.annotations.types"
      :key="index"
      v-model="typeToggles"
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
    configuredTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      icons: {},
      typeToggles: [],
    };
  },
  created() {
    this.icons = Icons;
  },
  methods: {
    typeDisabled(type) {
      return !this.configuredTypes.includes(type);
    },
  },
};
</script>
