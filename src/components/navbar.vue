<template>
  <div>
    <q-btn
      unelevated
      color="black q-pr-sm"
      class="q-mb-md"
      :disabled="itemindex <= 0"
      @click="toggleSheet(--itemindex)"
      >
      <q-icon
        :name="fasArrowLeft"
        size="24px"
        class="q-pr-sm"
      />
      {{ captionprev }}
    </q-btn>

    <!-- <q-input
      color="teal"
      class="q-mb-md"
      dense
      min="1"
      standout
      type="number"
      :placeholder="config.labels.item"
      >
      <template v-slot:append>
        <q-icon
          :name="fasCheck"
          size="20px"
        />
      </template>
    </q-input> -->

    <q-btn
      unelevated
      class="q-mb-md"
      color="black"
      :disabled="itemindex >= itemurls.length - 1"
      @click="toggleSheet(++itemindex)"
      >
      {{ captionnext }}
      <q-icon
        :name="fasArrowRight"
        size="24px"
        class="q-pl-sm"
      />
    </q-btn>
  </div>
</template>

<script>
import Navigation from '@/mixins/navigation';
import { fasArrowRight, fasArrowLeft, fasCheck } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Navbar',
  mixins: [Navigation],
  created() {
    this.fasArrowRight = fasArrowRight;
    this.fasArrowLeft = fasArrowLeft;
    this.fasCheck = fasCheck;
  },
  methods: {
    toggleSheet(itemIndex) {
      const link = this.itemurls[itemIndex];
      const tree = document.getElementsByClassName('view-tree')[0];

      window.location.hash = `selectedItem-${link}`;
      tree.scrollBy(0, -80);

      this.sequenceindex = this.computedsequenceindex;
      this.updateItem(this.itemurls[itemIndex]);
      this.updateSequenceIndex(this.sequenceindex);
    },
  },
};
</script>

<style lang="scss" scoped>
  button:first-of-type {
    @media (min-width: 600px) {
      margin-right: 8px;
    }
  }
  .q-input {
    width: 100%;
    @media (min-width: 600px) {
      margin-right: 8px;
      width: 150px;
    }
  }
</style>
