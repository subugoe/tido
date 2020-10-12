<template>
  <!-- FIXME: semantically this is not a section -->
  <section class="filter-buttons">
    <q-btn-dropdown
      v-if="$q.screen.width < 1100"
      flat
      split
      :class="$q.dark.isActive ? 'bg-black' : 'bg-grey-9'"
      class="q-mb-md q-mr-md"
      label="Toggle Panels"
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

<style lang="scss" scoped>
.filter-buttons {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
