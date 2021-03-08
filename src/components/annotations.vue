<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm scroll-panel"
  >
    <!-- Data type Toggles -->
    <div>
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          Show / hide data types
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
          v-for="(annotation, index) in items"
          :key="index"
        >
          <q-item-section avatar>
            <q-icon :name="entity.icons[annotation.contenttype]" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              :class="[entity.selected ? 'highlight' : '']"
              overline
              class="text-uppercase"
              @click="getEntityId(index, annotation.contenttype)"
            >
              {{ annotation.text }} ( {{ annotation.comment }} )
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
    annotationids: {
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
      entityid: '',
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
        selected: false,
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
      if (this.annotations.length) {
        return Object.values(this.annotationids).filter((type) => this.annotationType === type.contenttype);
      }
      return [];
    },
  },
  created() {
    this.mdiAccount = mdiAccount;
    this.mdiMapMarker = mdiMapMarker;
    this.mdiComment = mdiComment;
  },
  mounted() {

  },
  methods: {
    getEntityId(targetId, contentType) {
      // const split = targetId.split('/');
      // this.entityid = split[split.length - 1];

      this.$root.$emit('update-entity-id', this.entityid, contentType);
      // eslint-disable-next-line
      console.log('__ANNOTATIONS__', this.annotationids);
    },
  },
};
</script>

<style lang="scss" scoped>
  .highlight {
    background-color: 'grey';
  }
</style>
