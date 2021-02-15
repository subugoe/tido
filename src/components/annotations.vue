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
      IDs: [],
    };
  },
  computed: {
    /**
    * get target IDs
    * caller: *mounted-hook*
    */
    getAnnotationIds() {
      const IDs = [];
      const targetURIs = [];

      if (Array.isArray(this.annotations.items)) {
        this.annotations.items.forEach((item) => {
          targetURIs.push(item.target.id);
        });
        targetURIs.forEach((target) => {
          IDs.push(targetURIs.split('/')[target.length - 1]);
        });
      }
      // eslint-disable-next-line no-console
      console.log(':: ANNOTATIONS ::', IDs);
      return IDs;
    },
  },
  mounted() {
    this.IDs = this.getAnnotationIds;
  },
};
</script>
