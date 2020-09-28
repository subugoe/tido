<template>
  <section class="panel-position">
    <q-btn class="btn-panel" :icon="panelicon" @click="status = true" label="Configure" flat />

    <q-dialog v-model="status" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: 600px">
        <q-card-section>
          <div class="text-h6 text-capitalize">Customize Panels</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <Dragpanelboxes :data="panelboxes" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-black">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import Dragpanelboxes from '@/components/util/panelboxes.vue';
import { fasSolarPanel } from '@quasar/extras/fontawesome-v5';

export default {
  components: {
    Dragpanelboxes,
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

<style lang="scss" scoped>
  .btn-panel {
    height: 75%;
  }

  .panel-position {
    display: flex;
    justify-content: center;
  }
</style>
