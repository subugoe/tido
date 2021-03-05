<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm scroll-panel"
  >
    <!-- Data type Toggles -->
    <div>
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          Show / hide data types ( {{ annotations.length }} / {{ annotationcontext.partOf.total }} )
        </q-toolbar-title>
      </q-toolbar>

      <q-btn-toggle
        v-model="entity.model"
        clearable
        spread
        :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
        :options="entity.options"
        @click="annotationType = entity.model"
      />
    </div>

    <!-- List of Anotations -->
    <div
      v-if="items.length"
      class="q-mt-lg"
    >
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          List of annotations in sheet
        </q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item
          v-for="annotation in items"
          :key="annotation.id"
        >
          <q-item-section avatar>
            <q-icon :name="entity.icons[annotation.body['x-content-type']]" />
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
    annotationcontext: {
      type: Object,
      default: () => {},
    },
    annotations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      annotationType: '',
      entity: {
        icons: {
          Comment: mdiComment,
          Person: mdiAccount,
          Place: mdiMapMarker,
        },
        model: null,
        options: [
          { label: 'Names', icon: mdiAccount, value: 'Person' },
          { label: 'Places', icon: mdiMapMarker, value: 'Place' },
          { label: 'Comments', icon: mdiComment, value: 'Comment' },
        ],
      },
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
    };
  },
  computed: {
    items() {
      return this.annotations.filter((type) => this.annotationType === type.body['x-content-type']);
    },
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
