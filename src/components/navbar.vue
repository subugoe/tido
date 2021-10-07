<template>
  <div>
    <q-btn
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
      :disabled="itemindex <= 0"
      size="xs"
      padding="xs"
      class="q-px-sm q-mr-sm"
      @click="toggleSheet(--itemindex)"
    >
      <q-icon
        :name="fasArrowLeft"
        size="16px"
        class="q-pr-xs"
      />
      {{ captionprev }}
    </q-btn>

    <q-btn
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
      :disabled="itemindex >= itemurls.length - 1"
      size="xs"
      padding="xs"
      class="q-px-sm"
      @click="toggleSheet(++itemindex)"
    >
      {{ captionnext }}
      <q-icon
        :name="fasArrowRight"
        size="16px"
        class="q-pl-xs"
      />
    </q-btn>
  </div>
</template>

<script>
import Navigation from '@/mixins/navigation';
import { fasArrowRight, fasArrowLeft, fasCheck } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Navbar',
  mixins: [Navigation],
  props: {
    defaultView: {
      type: Function,
      default: () => {},
    },
  },
  created() {
    this.fasArrowRight = fasArrowRight;
    this.fasArrowLeft = fasArrowLeft;
    this.fasCheck = fasCheck;
  },
};
</script>

<style lang="scss" scoped>
button {
  font-size: 12px !important;
}

.q-input {
  width: 100%;
  @media (min-width: 600px) {
    margin-right: 8px;
    width: 160px;
  }
}
</style>
