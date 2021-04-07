<template>
  <div>
    <q-btn-dropdown
      v-if="$q.screen.width < 1100"
      :dropdown-icon="dropicon"
      outline
      flat
      :class="$q.dark.isActive ? 'bg-black' : 'bg-secondary text-black'"
      label="Toggle panels"
    >
      <slot />
    </q-btn-dropdown>

    <div
      v-else
      class="without-dropdown"
    >
      <slot />
    </div>
  </div>
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
