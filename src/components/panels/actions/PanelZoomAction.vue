<template>
  <div>
    <q-btn
      flat
      round
      icon="bi-zoom-in"
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
      icon="bi-zoom-out"
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
import { icon } from '@/utils/icon';

export default {
  name: 'PanelZoomAction',
  data: () => ({
    disableIncrease: false,
    disableDecrease: false,
    value: 0
  }),
  props: {
    min: Number,
    max: Number,
    step: Number,
    startValue: Number
  },
  mounted() {
    this.value = this.startValue;
  },
  methods: {
    icon(name) {
      return icon(name);
    },
    increase() {
      this.value = this.value + this.step;
      this.$emit('update', this.value);

      if (this.value >= this.max) {
        this.disableIncrease = true;
      } else {
        this.disableIncrease = false;
        this.disableDecrease = false;
      }
    },
    decrease() {
      this.value = this.value - this.step;
      this.$emit('update', this.value);

      if (this.value <= this.min) {
        this.disableDecrease = true;
      } else {
        this.disableIncrease = false;
        this.disableDecrease = false;
      }
    },
  }
};
</script>

<style scoped>

</style>
