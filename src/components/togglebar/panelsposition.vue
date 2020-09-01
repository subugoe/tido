<template>
  <section class="panel-position">
    <q-btn class="btn-panel" :icon="panelicon" @click="status = true" label="Configure" flat />

    <q-dialog v-model="status" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: 450px">
        <q-card-section>
          <div class="text-h6 text-capitalize">Customize Panels</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <Dragboxes :boxs="panelboxes" @updated="(b) => $root.$emit('panels-position', b)" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-black">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import Dragboxes from '@/components/util/dragboxes';
import { fasSolarPanel } from '@quasar/extras/fontawesome-v5';

export default {
  components: {
    Dragboxes,
  },
  props: {
    panelboxes: Array,
  },
  data: () => ({
    status: false,
  }),
  computed: {
    panelicon() {
      return fasSolarPanel;
    },
  },
};
</script>

<style lang="sass" scoped>
  .btn-panel
    height: 75%

  .panel-position
    display: flex
    justify-content: center
</style>
