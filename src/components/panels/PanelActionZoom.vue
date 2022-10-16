<template>
  <div>
    <q-btn
      class="cursor-pointer"
      flat
      round
      size="sm"
      :disable="disableIncrease"
      :title="$t('increase')"
      @click="increase()"
    >
      <q-icon
        :name="icon('fasSearchPlus')"
        size="xs"
        :color="$q.dark.isActive ? 'white' : 'primary'"
      />
    </q-btn>

    <q-btn
      class="cursor-pointer"
      flat
      round
      size="sm"
      :disable="disableDecrease"
      :title="$t('decrease')"
      :color="$q.dark.isActive ? 'white' : 'primary'"
      @click="decrease()"
    >
      <q-icon
        :name="icon('fasSearchMinus')"
        size="xs"
        :color="$q.dark.isActive ? 'white' : 'primary'"
      />
    </q-btn>
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

export default {
  name: 'PanelActionZoom',
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
      return Icons[name];
    },
    increase() {
      if (this.value >= this.max) {
        this.disableIncrease = true;
      } else {
        this.disableIncrease = false;
        this.value = this.value + this.step;
        this.$emit('update', this.value);
      }
    },
    decrease() {
      if (this.value <= this.min) {
        this.disableDecrease = true;
      } else {
        this.disableDecrease = false;
        this.value = this.value - this.step;
        this.$emit('update', this.value);
      }
    },
  }
};
</script>

<style scoped>

</style>
