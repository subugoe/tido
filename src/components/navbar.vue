<template>
  <div>
    <q-btn
      class="q-mb-md"
      unelevated
      :color="$q.dark.isActive ? 'grey-8' : 'accent'"
      :disabled="itemindex <= 0"
      @click="toggleSheet(--itemindex)"
      >
      <!-- FIXME: Size is best set with Quasar'xs-xl -->
      <q-icon
        class="q-pr-sm"
        :name="fasArrowLeft"
      />
      {{ captionprev }}
    </q-btn>

    <q-btn
      class="q-mb-md"
      size="md"
      unelevated
      :color="$q.dark.isActive ? 'grey-8' : 'accent'"
      :disabled="itemindex >= itemurls.length - 1"
      @click="toggleSheet(++itemindex)"
      >
      {{ captionnext }}
      <!-- FIXME: Size is best set with Quasar'xs-xl -->
      <q-icon
        :name="fasArrowRight"
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
