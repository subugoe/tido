<template>
  <div>
    <q-item-label
      v-if="keyIsTitle"
      overline
      class="text-uppercase"
    >
      {{ $t(item.key) }}
    </q-item-label>
    <MetadataLink
      v-if="isLink()"
      :url="item.key"
      :text="item.value"
    />
    <span v-else>{{ item.value }}</span>
    <MetadataItem
      v-for="(childItem, idx) in childItems"
      :key="idx"
      :item="childItem"
    />
  </div>
</template>

<script>
import MetadataLink from 'components/metadata/MetadataLink';

export default {
  name: 'MetadataItem',
  components: { MetadataLink },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    keyIsTitle: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    childItems() {
      return this.item.metadata || [];
    },
  },
  methods: {
    mounted() {

    },
    isLink() {
      const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
      const matches = this.item.key.match(regex);

      return matches !== null;
    },
  },
};
</script>

<style scoped>

</style>
