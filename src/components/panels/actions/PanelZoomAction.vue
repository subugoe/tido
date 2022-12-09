<template>
  <div class="panel-zoom-action">
    <q-btn
      flat
      round
      :icon="zoomInIcon"
      size="sm"
      :disable="disableIncrease"
      :title="$t('increase')"
      :color="$q.dark.isActive ? 'white' : 'primary'"
      @click="increase()"
    >
    </q-btn>

    <q-btn
      flat
      round
      :icon="zoomOutIcon"
      size="sm"
      :disable="disableDecrease"
      :title="$t('decrease')"
      :color="$q.dark.isActive ? 'white' : 'primary'"
      @click="decrease()"
    >
    </q-btn>
  </div>
</template>

<script>
import { biZoomIn, biZoomOut } from '@quasar/extras/bootstrap-icons';

export default {
  name: 'PanelZoomAction',
  data: () => ({
    disableIncrease: false,
    disableDecrease: false,
    value: 0,
  }),
  props: {
    min: Number,
    max: Number,
    step: Number,
    startValue: Number,
  },
  created() {
    this.zoomInIcon = biZoomIn;
    this.zoomOutIcon = biZoomOut;
  },
  mounted() {
    this.value = this.startValue;
  },
  methods: {
    increase() {
      this.value += this.step;
      this.$emit('update', this.value);

      if (this.value >= this.max) {
        this.disableIncrease = true;
      } else {
        this.disableIncrease = false;
        this.disableDecrease = false;
      }
    },
    decrease() {
      this.value -= this.step;
      this.$emit('update', this.value);

      if (this.value <= this.min) {
        this.disableDecrease = true;
      } else {
        this.disableIncrease = false;
        this.disableDecrease = false;
      }
    },
  },
};
</script>

<style scoped>
.panel-zoom-action {
  margin-right: -6px;
}
</style>
