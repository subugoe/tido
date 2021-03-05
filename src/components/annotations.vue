<template>
  <div class="q-ma-sm scroll-panel">
    <!-- Toggle data types -->
    <div>
      <q-toolbar v-if="annotations && annotations.items">
        <q-toolbar-title class="text-uppercase">
          Show / hide data types ( {{ annotations.items.length }} / {{ annotations.partOf.total }} )
        </q-toolbar-title>
      </q-toolbar>

      <q-btn-toggle
        v-model="typeModel"
        clearable
        spread
        :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
        :options="typeOptions"
        @click="filterTypes(typeModel)"
      />
    </div>

    <!-- List of Anotations -->
    <div
      v-if="items"
      class="scroll q-mt-lg"
    >
      <q-toolbar v-if="items.length">
        <q-toolbar-title class="text-uppercase">
          List of annotations in sheet
        </q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item
          v-for="annotation in items"
          :key="annotation.id"
          @click="getAnnotationId(annotation.target.id, annotation.body['x-content-type'])"
        >
          <q-item-section avatar>
            <q-icon :name="types[annotation.body['x-content-type']]" />
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

    <!-- Modifiers -->
    <div class="absolute-bottom">
      <div
        v-for="(modifier, index) in modifiers"
        :key="index"
        class="q-pa-md"
      >
        <div v-if="items.length > modifier.limit">
          <span class="text-uppercase">{{ modifier.label }}</span>

          <span class="float-right">
            <q-btn-toggle
              v-model="modifier.model"
              :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
              :options="modifier.options"
              size="md"
            />
          </span>
        </div>
      </div>
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
      items: [],
      modifiers: [
        {
          label: 'Highlight',
          limit: 0,
          model: null,
          options: [
            { label: 'All', value: 1 }, { label: 'None', value: 0 },
          ],
        },
        {
          label: 'Sorting order',
          limit: 1,
          model: null,
          options: [
            { label: 'Alphabetic', value: 1 }, { label: 'Appearance', value: 0 },
          ],
        },
        {
          label: 'Sorting direction',
          limit: 1,
          model: null,
          options: [
            { label: 'Ascending', value: 1 }, { label: 'Descending', value: 0 },
          ],
        },
      ],
      typeModel: null,
      typeOptions: [
        { label: 'Names', icon: mdiAccount, value: 'Person' },
        { label: 'Places', icon: mdiMapMarker, value: 'Place' },
        { label: 'Comments', icon: mdiComment, value: 'Comment' },
      ],
      types: {
        Comment: mdiComment,
        Person: mdiAccount,
        Place: mdiMapMarker,
      },
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
      // eslint-disable-next-line no-console
      console.log('__FILTER_TYPES__', type, this.items);
    },
    getAnnotationId(targetId, contentType) {
      const split = targetId.split('/');
      const id = split[split.length - 1];

      // eslint-disable-next-line no-console
      console.log('__ANNOTATION_ID__', targetId, contentType);
      this.$root.$emit('update-annotation-id', id, contentType);
    },
  },
};
</script>
