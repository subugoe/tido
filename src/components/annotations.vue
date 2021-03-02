<template>
  <div
    v-if="Object.keys(annotations).length"
    class="scroll-panel q-ma-md"
  >
    <!-- <q-btn-toggle
      v-model="toggles"
      :options="[
        { label: 'Names', icon: mdiAccount, value: '1' },
        { label: 'Places', icon: mdiMapMarker, value: '2' },
        { label: 'Comments', icon: mdiComment, value: '3' },
      ]"
      spread
      toggle-color="grey"
    /> -->

    <div class="q-mb-md">
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          Show / hide data types
        </q-toolbar-title>
      </q-toolbar>

      <q-btn-group
        class="sticky q-mt-md"
        spread
      >
        <q-btn
          dense
          :icon="mdiAccount"
          label="Names"
          outline
        />
        <q-btn
          dense
          :icon="mdiMapMarker"
          label="Places"
          outline
        />
        <q-btn
          dense
          :icon="mdiComment"
          label="Comments"
          outline
        />
      </q-btn-group>
    </div>

    <!-- <q-list>
      <q-item>
        <q-item-section class="text-uppercase">
          Total: {{ annotations.items.length }} / {{ annotations.partOf.total }}
        </q-item-section>
      </q-item>
    </q-list> -->

    <div class="q-mt-md">
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          List of names in sheet
        </q-toolbar-title>
      </q-toolbar>

      <q-list v-if="Array.isArray(annotations.items)">
        <q-item
          v-for="annotation in annotations.items"
          :key="annotation.id"
          class="q-pa-sm"
        >
          <q-item-section avatar>
            <q-icon :name="mdiAccount" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              overline
              class="text-uppercase"
              @click="getAnnotationId(annotation.target.id, annotation.body['x-content-type'])"
            >
              {{ annotation.body.value }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
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
      toggles: null,
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
