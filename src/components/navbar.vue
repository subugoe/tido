<template>
  <div class="q-gutter-sm">
    <q-btn
      unelevated
      color="black"
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

    <q-btn
      unelevated
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
import { fasArrowRight, fasArrowLeft } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Navbar',
  mixins: [Navigation],
  created() {
    this.fasArrowRight = fasArrowRight;
    this.fasArrowLeft = fasArrowLeft;
  },
};
</script>
