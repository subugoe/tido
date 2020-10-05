<template>
  <!-- FIXME: semantically this is not a section -->
  <section class="filter-buttons">
    <q-btn-dropdown v-if="$q.screen.width < 1100"
      class="toggle-filter__button q-mb-md"
      label="Toggle Panels"
      >
      <slot />
    </q-btn-dropdown>

    <div class="q-mb-md toggle-filter__button without-dropdown" v-else>
      <slot />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.filter-buttons {
  align-items: center;
  display: flex;
  justify-content: center;
}

.toggle-filter__button {
  background-color: $color-toggle-filter__button__background;
  color: $color-toggle-filter__button__font;
  @media (prefers-color-scheme: dark) {
    background-color: $color-toggle-filter__button__background--dark;
    color: $color-toggle-filter__button__font--dark;
  }

  &:active,
  &:hover,
  &:focus {
    background-color: $color-toggle-filter__button__background--active;
    color: $color-toggle-filter__button__font--active;
  }
}
</style>
