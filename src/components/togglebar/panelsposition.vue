<template>
  <section class="panel-position">
    <q-btn class="btn-panel" @click="status = true" flat>
      <q-icon :name="panelicon" />
    </q-btn>
    <q-dialog v-model="status" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 450px">
        <q-card-section>
          <div class="text-h6">Customize panels</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <Dragboxes :boxs="panelboxes" @updated="(b) => $root.$emit('panels-position', b)" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
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
  .panel-position
    display: flex
    justify-content: center
  .btn-panel
    height: 75%
</style>
