<template>
  <div>
    <q-btn
      class="q-mb-md"
      unelevated
      :disabled="itemindex <= 0"
      @click="toggleSheet(--itemindex)"
      >

      <q-icon
        class="q-pr-sm"
        :name="fasArrowLeft"
        size="sm"
      />
      {{ captionprev }}
    </q-btn>

    <q-btn
      class="q-mb-md"
      unelevated
      :disabled="itemindex >= itemurls.length - 1"
      @click="toggleSheet(++itemindex)"
      >
      {{ captionnext }}

      <q-icon
        :name="fasArrowRight"
        size="sm"
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
    width: 160px;
  }
}
</style>
