<template>
  <section class="panel__position">
    <q-btn
      class="panel__button"
      :icon="panelicon"
      size="md"
      label="Customize"
      outline
      @click="status = true"
    />

    <q-dialog
      v-model="status"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        :class="$q.dark.isActive ? 'bg-black' : 'bg-white text-black'"
        class="panel__card"
      >
        <q-card-section>
          <div class="text-h6 text-uppercase">
            Customize Panels
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <Dragpanelboxes :data="panelboxes" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="OK"
          />
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
    panelboxes: {
      type: Array,
      default: () => [],
    },
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
.panel__position {
  display: flex;
  justify-content: center;
}

.panel__card {
  width: 600px;
}

.panel__button {
  height: 75%;
}
</style>
