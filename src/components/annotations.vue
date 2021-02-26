<template>
  <div
    v-if="Object.keys(annotations).length"
    class="scroll-panel"
  >
    <q-list>
      <q-item>
        <q-item-section class="text-h6 caps">
          Part of:
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>
            {{ annotations.partOf.label }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-uppercase">
          Total: {{ annotations.items.length }} / {{ annotations.partOf.total }}
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator
      class="q-mt-md q-mb-sm"
      inset
    />

    <q-list v-if="Array.isArray(annotations.items)">
      <q-item
        v-for="annotation in annotations.items"
        :key="annotation.id"
      >
        <q-item-section class="q-mb-sm">
          <q-item-label
            overline
            class="text-uppercase"
            @click="getAnnotationId(annotation.target.id, annotation.body['x-content-type'])"
          >
            Type: {{ annotation.body.value }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
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
  methods: {
    getAnnotationId(targetId, contentType) {
      const split = targetId.split('/');
      const id = split[split.length - 1];

      this.$root.$emit('update-annotation-id', id, contentType);
    },
  },
};
</script>
