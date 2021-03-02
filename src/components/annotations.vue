<template>
  <div
    v-if="Object.keys(annotations).length"
    class="scroll-panel q-ma-md"
  >
    <q-btn-group spread>
      <q-btn
        :icon="mdiAccount"
        label="Names"
        outline
      />
      <q-btn
        :icon="mdiMapMarker"
        label="Places"
        outline
      />
      <q-btn
        :icon="mdiComment"
        label="Comments"
        outline
      />
    </q-btn-group>

    <q-list>
      <q-item>
        <q-item-section class="text-uppercase">
          Total: {{ annotations.items.length }} / {{ annotations.partOf.total }}
        </q-item-section>
      </q-item>
    </q-list>

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
import { mdiAccount, mdiMapMarker, mdiComment } from '@quasar/extras/mdi-v5';

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
  created() {
    this.mdiAccount = mdiAccount;
    this.mdiMapMarker = mdiMapMarker;
    this.mdiComment = mdiComment;
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
