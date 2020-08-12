<template>
  <section id="filterBtns">
    <q-btn-dropdown v-if="$q.screen.width < 1100"
      class="q-mb-md"
      color="black"
      label="Toggle panels ..."
      >
      <slot />
    </q-btn-dropdown>

    <div class="without-dropdown" v-else>
      <slot />
    </div>
  </section>
</template>

<style lang="sass" scoped>
  #filterBtns
    align-items: center
    display: flex
    justify-content: center
</style>
