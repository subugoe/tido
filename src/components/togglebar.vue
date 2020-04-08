<template>
  <ul class="sub-viewer-1-nav__items" title="Tab options">
    <li v-for="(name, idx) in panels" :key="idx">
      <button
        class="sub-viewer-1-nav-item"
        :aria-selected="toggleAria(idx)"
        :title="toggleTitle(idx)"
        @click="updateStatus(idx);"
        >
        <!-- NOTE:
          if vectors are passed down from parent, the icons don't render;
          hence just the svg paths are passed and toggled.
        -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path :d="togglePath(idx)" transform="translate(56 56)"></path>
        </svg>
        <span aria-hidden="true">{{ name }}</span>
      </button>
    </li>

    <li>
      <button class="sub-viewer-1-reset" title="Reset Tabs" @click="resetPanelStatus();">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path :d="svg.undo" transform="translate(56 59)"></path>
        </svg>
        <span aria-hidden="true">{{ 'Reset Tabs' | capitalize }}</span>
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Togglebar',
  props: {
    status: Object,
    vectors: Object,
  },
  data() {
    return {
      panels: ['treeview', 'text', 'image', 'metadata'],
      svg: {
        'check-circle': 'M200,0 C89.5427419,0 0,89.5427419 0,200 C0,310.457258 89.5427419,400 200,400 C310.457258,400 400,310.457258 400,200 C400,89.5427419 310.457258,0 200,0 Z M200,38.7096774 C289.13871,38.7096774 361.290323,110.847581 361.290323,200 C361.290323,289.13871 289.152419,361.290323 200,361.290323 C110.86129,361.290323 38.7096774,289.152419 38.7096774,200 C38.7096774,110.86129 110.847581,38.7096774 200,38.7096774 M313.067742,143.76371 L294.893548,125.442742 C291.129839,121.648387 285.002419,121.623387 281.208065,125.387903 L167.214516,238.465323 L118.995161,189.854839 C115.231452,186.060484 109.104032,186.035484 105.309677,189.799194 L86.9879032,207.973387 C83.1935484,211.737097 83.1685484,217.864516 86.9330645,221.659677 L160.143548,295.462903 C163.907258,299.257258 170.034677,299.282258 173.829032,295.517742 L313.01371,157.45 C316.807258,153.685484 316.831452,147.558065 313.067742,143.76371 L313.067742,143.76371 Z',
        circle: 'M200,0 C89.516129,0 0,89.516129 0,200 C0,310.483871 89.516129,400 200,400 C310.483871,400 400,310.483871 400,200 C400,89.516129 310.483871,0 200,0 Z M200,361.290323 C110.887097,361.290323 38.7096774,289.112903 38.7096774,200 C38.7096774,110.887097 110.887097,38.7096774 200,38.7096774 C289.112903,38.7096774 361.290323,110.887097 361.290323,200 C361.290323,289.112903 289.112903,361.290323 200,361.290323 Z',
        undo: 'M9.52380952,-0.00019195871 L31.5166667,-0.00019195871 C36.8650794,-0.00019195871 41.1650794,4.4031746 41.0380952,9.75079365 L39.1753968,87.9793651 C74.5436508,34.7888889 135.088889,-0.214285714 203.803968,-0.00019195871 C312.047619,0.33968254 400.169048,88.8960317 400.000243,197.139683 C399.830159,305.699206 311.77381,393.650794 203.174603,393.650794 C152.439683,393.650794 106.188889,374.454762 71.2873016,342.930159 C67.2293651,339.265079 67.0380952,332.961111 70.9047619,329.094444 L86.5698413,313.429365 C90.1396825,309.859524 95.897619,309.631746 99.665873,312.99127 C127.153175,337.496825 163.40873,352.380952 203.174603,352.380952 C289.144444,352.380952 358.730159,282.807937 358.730159,196.825397 C358.730159,110.855556 289.157143,41.2698413 203.174603,41.2698413 C140.043651,41.2698413 85.7611111,78.7952381 61.3690476,132.779365 L161.677778,130.39127 C167.024603,130.264286 171.428571,134.563492 171.428571,139.912698 L171.428571,161.904762 C171.428571,167.164286 167.164286,171.428571 161.904762,171.428571 L9.52380952,171.428571 C4.26428571,171.428571 0,167.164286 0,161.904762 L0,9.52380952 C0,4.26428571 4.26428571,-0.00019195871 9.52380952,-0.00019195871 Z',
      },
    };
  },
  filters: {
    capitalize(s) {
      return s.toUpperCase();
    },
  },
  methods: {
    resetPanelStatus() {
      for (let index = 0; index < this.panels.length; index += 1) {
        this.status[this.panels[index]] = true;
      }
      this.$root.$emit('update-panel-status', this.status);
    },
    toggleAria(id) {
      return !!this.status[this.panels[id]];
    },
    togglePath(id) {
      return this.status[this.panels[id]]
        ? this.svg['check-circle']
        : this.svg.circle;
    },
    toggleTitle(id) {
      const caption = this.ucfirst(this.panels[id]);
      return this.status[this.panels[id]] ? `Hide ${caption} Tab` : `Show ${caption} Tab`;
    },
    ucfirst(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    updateStatus(id) {
      this.status[this.panels[id]] = !this.status[this.panels[id]];
      this.$root.$emit('update-panel-status', this.status);
    },
  },
};
</script>
