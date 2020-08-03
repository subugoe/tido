<template>
  <div>
    <q-btn
      unelevated
      class="q-mb-md"
      color="black q-pr-sm"
      :disabled="itemindex <= 0"
      @click="toggleSheet(--itemindex)"
      >
      <q-icon
        :name="fasArrowLeft"
        size="24px"
        class="q-pr-sm"
      />
      {{ captionprev }}
    </q-btn>

    <q-btn
      unelevated
      class="q-mb-md"
      color="black"
      :disabled="itemindex >= itemurls.length - 1"
      @click="toggleSheet(++itemindex)"
      >
      {{ captionnext }}
      <q-icon
        :name="fasArrowRight"
        size="24px"
        class="q-pl-sm"
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
  created() {
    this.fasArrowRight = fasArrowRight;
    this.fasArrowLeft = fasArrowLeft;
    this.fasCheck = fasCheck;
  },
};
</script>

<style lang="scss" scoped>
  button:first-of-type {
    @media (min-width: 600px) {
      margin-right: 8px;
    }
  }
  .q-input {
    width: 100%;
    @media (min-width: 600px) {
      margin-right: 8px;
      width: 150px;
    }
  }
</style>
