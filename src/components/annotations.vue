<template>
  <div>
    <q-list>
      <q-item
        v-for="anno in Object.entries(annotations)"
        :key="anno.id"
      >
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ anno[0] }}
          </q-item-label>
          <q-item-label>{{ anno[1] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'Annotations',
  props: {
    annotations: Object,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
