<template>
  <q-list v-if="Array.isArray(annotations.items)">
    <q-item
      v-for="annotation in annotations.items"
      :key="annotation.id"
    >
      <q-item-section>
        <q-item-label
          overline
          class="text-uppercase"
        >
          {{ annotation.bodyValue }}
        </q-item-label>

        <q-item-label>
          {{ annotation.target.id }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'Annotations',
  props: {
    annotations: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {

    };
  },
  mounted() {

  },
};
</script>
