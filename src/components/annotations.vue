<template>
  <div class="q-ma-sm">
    <div class="sticky q-mb-md">
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          Show / hide data types ( {{ annotations.items.length }} / {{ annotations.partOf.total }} )
        </q-toolbar-title>
      </q-toolbar>

      <q-btn-toggle
        v-model="toggle"
        clearable
        :options="[
          { label: 'Names', icon: mdiAccount, value: 'Person' },
          { label: 'Places', icon: mdiMapMarker, value: 'Place' },
          { label: 'Comments', icon: mdiComment, value: 'Comment' },
        ]"
        spread
        toggle-color="white"
        toggle-text-color="black"
        @click="filterTypes(toggle)"
      />
    </div>

    <div
      v-if="entities"
      class="q-mt-md"
    >
      <q-toolbar v-if="toggle && items.length">
        <q-toolbar-title class="text-uppercase">
          List of annotations in sheet
        </q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item
          v-for="annotation in items"
          :key="annotation.id"
          class="q-pa-sm"
          @click="getAnnotationId(annotation.target.id, annotation.body['x-content-type'])"
        >
          <q-item-section avatar>
            <q-icon :name="contentTypes[annotation.body['x-content-type']]" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              overline
              class="text-uppercase"
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
      contentTypes: {
        Comment: mdiComment,
        Person: mdiAccount,
        Place: mdiMapMarker,
      },
      items: [],
      toggle: null,
    };
  },
  computed: {
    entities() {
      return Array.isArray(this.annotations.items) && this.annotations.items.length;
    },
  },
  created() {
    this.mdiAccount = mdiAccount;
    this.mdiMapMarker = mdiMapMarker;
    this.mdiComment = mdiComment;
  },
  methods: {
    filterTypes(type) {
      this.items = this.annotations.items.filter((t) => type === t.body['x-content-type']);
    },
    getAnnotationId(targetId, contentType) {
      const split = targetId.split('/');
      const id = split[split.length - 1];

      this.$root.$emit('update-annotation-id', id, contentType);
    },
  },
};
</script>

<style lang="scss" scoped>
  .person {
    background-color: 'white';
  }
</style>
