<template>
  <div>
    <q-item-label v-if="!isLink()" overline class="text-uppercase">
      {{ $t(label) }}
    </q-item-label>
    <MetadataLink v-if="isLink()" :url="item.key" :text="item.value"/>
    <MetadataValue v-else :value="item.value" />
    <MetadataItem v-for="(childItem, idx) in childItems" :key="idx" :item="childItem"/>
  </div>
</template>

<script>
import MetadataLink from '@/components/metadata/MetadataLink.vue';
import MetadataValue from '@/components/metadata/MetadataValue.vue';

export default {
  name: 'MetadataItem',
  components: { MetadataValue, MetadataLink },
  props: {
    item: Object,
  },
  computed: {
    label() {
      return this.item?.key || 'other';
    },
    childItems() {
      return this.item?.metadata || [];
    },
  },
  methods: {
    isLink() {
      const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
      const matches = this.item?.key?.match(regex) || null;

      return matches !== null;
    },
  },
};
</script>

<style scoped>

</style>
