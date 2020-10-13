<template>
  <!-- FIXME: semantically this is not a section -->
  <section class="filter-buttons">
    <q-btn-dropdown
      v-if="$q.screen.width < 1100"
      :dropdown-icon="dropicon"
      outline
      flat
      :class="$q.dark.isActive ? 'bg-black' : 'bg-secondary text-black'"
      class="q-mb-md q-mr-md"
      label="Toggle panels"
      >
      <slot />
    </q-btn-dropdown>

    <div
      class="q-mb-md without-dropdown q-mr-md"
      v-else
      >
      <slot />
    </div>
  </section>
</template>

<script>
import { fasCaretDown } from '@quasar/extras/fontawesome-v5';

export default {
  computed: {
    dropicon() {
      return fasCaretDown;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-buttons {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
