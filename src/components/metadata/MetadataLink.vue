<template>
  <a
    :href="url"
    :title="text + '- open in a new tab or window'"
    rel="noopener noreferrer"
    target="_blank"
    class="content__link"
    :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
  >
    <span>{{ text }}</span>

    <q-icon
      :name="fasExternalLinkAlt"
      size="12px"
      class="content__link-icon q-pl-xs"
    />
  </a>
</template>

<script>
import { fasExternalLinkAlt } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'MetadataLink',
  props: {
    url: {
      type: String,
      default: () => '',
    },
    text: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    fasExternalLinkAlt: () => fasExternalLinkAlt,
  },
};
</script>

<style scoped>

</style>
