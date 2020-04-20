<template>
  <div>
    <q-btn
      unelevated
      color="black q-pr-sm"
      class="q-mb-md"
      :disabled="itemindex <= 0"
      @click="
        --itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
      <q-icon
        :name="fasArrowLeft"
        size="24px"
        class="q-pr-sm"
        />
      {{ captionprev }}
    </q-btn>

    <q-input
      color="teal"
      class="q-mb-md"
      standout
      style="max-width: 150px"
      type="number"
      placeholder="Page"
      dense
    >
      <template v-slot:append>
        <q-icon :name="fasCheck" />
      </template>
    </q-input>

    <q-btn
      unelevated
      class="q-mb-md"
      color="black"
      :disabled="itemindex >= itemurls.length - 1"
      @click="
        ++itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
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
};
</script>

<style lang="scss" scoped>
button:first-of-type {
  @media (min-width: 600px) {
    margin-right: 8px;
  }
}
.q-input {
  @media (min-width: 600px) {
    margin-right: 8px;
    width: 150px;
  }
}
</style>
