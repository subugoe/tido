<template>
  <section class="panel-position">
    <q-btn
      class="panel-position__button"
      :icon="panelicon"
      @click="status = true"
      label="Customize"
      flat
      />

    <q-dialog
      v-model="status"
      persistent
      transition-show="scale"
      transition-hide="scale"
      >
      <!-- FIXME: remove inline style -->
      <q-card
        class="panel-position__modal"
        style="width: 600px;"
        >
        <q-card-section>
          <div class="text-h6 text-uppercase">Customize Panels</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <Dragpanelboxes :data="panelboxes" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            v-close-popup
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
.panel-position__button {
  background-color: $color-panel-position__button__background;
  color: $color-panel-position__button__font;
  height: 75%;
  @media (prefers-color-scheme: dark) {
    background-color: $color-panel-position__button__background--dark;
    color: $color-panel-position__button__font--dark;
  }

  &:active,
  &:hover,
  &:focus {
    background-color: $color-panel-position__button__background--active;
    color: $color-panel-position__button__font--active;
  }
}

.panel-position__modal {
  background-color: $color-panel-position__modal__background;
  color: $color-panel-position__modal__font;
}

.panel-position {
  display: flex;
  justify-content: center;
}
</style>
