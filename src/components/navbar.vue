<template>
  <div class="nav-bar">
    <q-btn
      class="nav-bar__button q-mb-md"
      unelevated
      :disabled="itemindex <= 0"
      @click="toggleSheet(--itemindex)"
      >
      <!-- FIXME: Size is best set with Quasar'xs-xl -->
      <q-icon
        class="q-pr-sm"
        :name="fasArrowLeft"
        size="24px"
      />
      {{ captionprev }}
    </q-btn>

    <q-btn
      class="nav-bar__button q-mb-md"
      unelevated
      :disabled="itemindex >= itemurls.length - 1"
      @click="toggleSheet(++itemindex)"
      >
      {{ captionnext }}
      <!-- FIXME: Size is best set with Quasar'xs-xl -->
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

.nav-bar {
  background-color: $color-nav-bar__background;
  color: $color-nav-bar__font-color;
}

.nav-bar__button {
  background-color: $color-nav-bar__button__background;
  color: $color-nav-bar__button__font-color;
  @media (prefers-color-scheme: dark) {
    background-color: $color-nav-bar__button__background--dark;
    color: $color-nav-bar__button__font-color--dark;
  }
  svg {
    fill: $color-nav-bar__icon;
    @media (prefers-color-scheme: dark) {
      fill: $color-nav-bar__icon--dark;
    }
  }
  &:active,
  &:hover,
  &:focus {
    background-color: $color-nav-bar__button__background--active;
    @media (prefers-color-scheme: dark) {
      background-color: $color-nav-bar__button__background--active-dark;
    }
  }
  &:disabled {
    background-color: $color-nav-bar__button__background--disabled;
    @media (prefers-color-scheme: dark) {
      background-color: $color-nav-bar__button__background--disabled-dark;
    }
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
