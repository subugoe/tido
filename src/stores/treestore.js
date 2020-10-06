export default {
  state: {
    selectedItemTree: null,
    seqTree: null,
  },
  updateselectedtreeitem(updatedvalue) {
    this.state.selectedItemTree = updatedvalue;
  },

  updatetreesequence(updatedvalue) {
    this.state.seqTree = updatedvalue;
  },
};
