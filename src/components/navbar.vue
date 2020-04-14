<template>
  <div class="sub-viewer-1__nav-arrows">
    <button
      class="sub-viewer-1__nav-arrow sub-viewer-1__nav-arrow--left"
      :title="titleprev"
      :disabled="itemindex <= 0"
      @click="
        --itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
      <img height="24" width="24" src="statics/icons/arrow-alt-left--normal.svg" />
      <span aria-hidden="true">{{ captionprev }}</span>
    </button>

    <button
      class="sub-viewer-1__nav-arrow sub-viewer-1__nav-arrow--right"
      :title="titlenext"
      :disabled="itemindex >= itemurls.length - 1"
      @click="
        ++itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
      <span aria-hidden="true">{{ captionnext }}</span>
      <img height="24" width="24" src="statics/icons/arrow-alt-right--normal.svg" />
    </button>
  </div>
</template>

<script>
import Navigation from '@/mixins/navigation';

export default {
  name: 'Navbar',
  mixins: [Navigation],
};
</script>
