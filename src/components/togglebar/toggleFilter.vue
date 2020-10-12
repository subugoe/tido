<template>
  <section class="filter-buttons">
    <q-btn-dropdown v-if="$q.screen.width < 1100"
      class="q-mb-md"
      color="black"
      :dropdown-icon="dropicon"
      label="Toggle panels ..."
      >
      <slot />
    </q-btn-dropdown>

    <div class="q-mb-md without-dropdown" v-else>
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
