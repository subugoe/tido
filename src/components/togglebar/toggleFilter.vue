<template>
  <div>
    <q-btn-dropdown
      v-if="$q.screen.width < 1200"
      :dropdown-icon="fasCaretDown"
      outline
      flat
      size="12px"
      padding="xs"
      class="button__dropdown q-px-sm"
      :class="$q.dark.isActive ? 'bg-black' : 'bg-secondary text-black'"
      :label="$t('showHidePanels')"
    >
      <slot />
    </q-btn-dropdown>

    <div
      v-else
      class="row"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { fasCaretDown } from '@quasar/extras/fontawesome-v5';

export default {
  // keep icon from reactivity
  created() {
    this.fasCaretDown = fasCaretDown;
  },
};
</script>
