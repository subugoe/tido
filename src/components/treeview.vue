<template>
  <nav class="tree">
    <button v-if="depth === 0"
      :class="[
        'tree__nav-item',
        'tree__nav-item--1',
        'tree__button',
        clicked ? 'tree__button--active' : ''
      ]"
      @click="clicked = !clicked;"
      >
      <div class="tree__icon">
        <img style="height: 16px; width: 16px;" src="statics/icons/caret-right--light.svg" />
      </div>
      <div class="tree__text">{{ label }}</div>
    </button>

    <ul v-else class="tree__item-list">
      <li>
        <button v-if="tree !== undefined"
          :class="[
            'tree__nav-item',
            'tree__nav-item--2',
            'tree__button',
            clicked ? 'tree__button--active' : ''
          ]"
          @click="clicked = !clicked;"
          >
          <div :class="['tree__icon', clicked ? 'tree__icon--active' : '']">
            <img style="height: 16px; width: 16px;" src="statics/icons/caret-right--light.svg" />
          </div>
          <div class="tree__text tree__text--2">{{ label }}</div>
        </button>

        <div v-else>
          <ul class="tree-data-item__list">
            <li class="tree__data-item" v-html="dataItem"></li>
          </ul>
        </div>
      </li>
    </ul>

    <div v-if="clicked">
      <div
        v-for="(node, key) in tree" :key="key"
        @click="
          url = node.label ? itemurl : node.id;
          updateItem(url);
          updateItemIndex(itemindex);
          updateMetadata(sequenceindex);
          updateSequenceIndex(sequenceindex);"
        >
        <Treeview
          :depth="depth + 1"
          :itemurl="itemurl"
          :itemurls="itemurls"
          :label="node.label ? node.label : node.id"
          :manifests="manifests"
          :tree="node.nodes"
        />
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Treeview',
  props: {
    depth: Number,
    itemurl: String,
    itemurls: Array,
    label: String,
    manifests: Array,
    tree: [Array, Object],
  },
  data() {
    return {
      clicked: false,
      url: '',
    };
  },
  methods: {
    updateItem() {
      if (this.itemurl === this.url) {
        return;
      }
      this.$root.$emit('update-item', this.url);
    },
    updateItemIndex() {
      this.$root.$emit('update-item-index', this.itemindex);
    },
    updateMetadata() {
      this.$root.$emit('update-metadata', this.sequenceindex);
    },
    updateSequenceIndex() {
      this.$root.$emit('update-sequence-index', this.sequenceindex);
    },
  },
  computed: {
    isactive() {
      // should not compare with label, rather use _something_ else.
      return this.itemurl === this.label;
    },
    dataItem() {
      if (this.isactive) {
        return `<img style="height: 16px; width: 16px;" src="statics/icons/angle-double-right--light.svg" />
                <span class="tree__data-item--active">${this.label}</span>`;
      }
      return `<button class="item-with-icon">
                <img style="height: 16px; width: 16px;" src="statics/icons/angle-right--light.svg" />
                  <span>${this.label}</span>
              </button>`;
    },
    itemindex() {
      let idx = 0;
      this.itemurls.forEach((item, index) => {
        if (item === this.url) {
          idx = index;
        }
      });
      return idx;
    },
    sequencecount() {
      return this.manifests.length;
    },
    itemspersequence() {
      const itemcount = [];

      for (let ctr = 0; ctr < this.sequencecount; ctr += 1) {
        itemcount[ctr] = this.manifests[ctr].sequence.length;
      }
      return itemcount;
    },
    sequenceindex() {
      const itemcount = this.itemspersequence;

      let itemidx = 0;
      let sequenceidx = 0;

      for (let ctr = 0; ctr < this.sequencecount; ctr += 1) {
        itemidx += itemcount[ctr];

        if (itemidx <= this.itemindex) {
          sequenceidx += 1;
        }
      }
      return sequenceidx;
    },
  },
  mounted() {
    this.clicked = this.depth === 0;

    this.$root.$on('update-tree-nodes', (index) => {
      if (this.$parent.tree && this.$parent.tree[index] && this.tree !== 'undefined') {
        this.clicked = this.$parent.tree[index].label === this.label;
      }
    });
  },
};
</script>
