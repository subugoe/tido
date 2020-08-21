<template>
  <div class="q-d-flex">
    <ToggleFilter>
      <q-list class="toggle-list">
        <q-item v-for="(name, idx) in togglekeys" :key="idx"
          class="bg-grey-2"
          clickable
          v-close-popup
          :aria-selected="toggleAria(idx)"
          :title="toggleTitle(idx)"
          @click="toggleIcon(idx); updateStatus(idx)"
          >
          <q-icon class="q-pr-xs" size="xs" :name="toggleIcon(idx)" />
          {{ panelstates[name].name | capitalize }}
        </q-item>

        <q-item
          class="bg-grey-5"
          clickable
          title="Reset panels to default view"
          v-close-popup
          @click="resetPanelStatus"
          >
           <q-icon class="q-pr-xs" size="xs" :name="fasUndo" />
          {{ 'Reset Panels' | capitalize }}
        </q-item>
      </q-list>
    </ToggleFilter>

    <PanelsPosition :panelboxes="panels"/>
  </div>
</template>

<script>
import {
  fasUndo,
  fasCircle,
  fasCheckCircle,
} from '@quasar/extras/fontawesome-v5';

import PanelsPosition from '@/components/togglebar/panelsposition';
import ToggleFilter from '@/components/togglebar/toggleFilter.vue';

export default {
  name: 'ToggleIndex',
  props: {
    config: Object,
    imageurl: String,
    panels: Array,
    panelstates: Object,
  },
  components: {
    PanelsPosition,
    ToggleFilter,
  },
  data() {
    return {
      states: {},
      togglekeys: [],
    };
  },
  filters: {
    capitalize(s) {
      return s.toUpperCase();
    },
  },
  methods: {
    keyExists(needle = '', haystack = []) {
      const index = haystack.indexOf(needle);
      return [index > -1, index];
    },
    resetPanelStatus() {
      // NOTE: just loop over the initial states formerly configured to be shown (e.g. *true*)
      // leave the initial panel/s configured to be hidden (e.g. *false*) untouched!
      for (let idx = 0; idx < this.togglekeys.length; idx += 1) {
        this.panelstates[this.togglekeys[idx]].show = true;
      }
      this.$root.$emit('update-panel-status', this.updateEmitter(this.panelstates));
    },
    toggleAria(id) {
      return !!this.panelstates[this.togglekeys[id]].show;
    },
    toggleIcon(id) {
      return this.panelstates[this.togglekeys[id]].show ? fasCheckCircle : fasCircle;
    },
    toggleTitle(id) {
      const caption = this.ucfirst(this.panelstates[this.togglekeys[id]].name);

      return this.panelstates[this.togglekeys[id]].show
        ? `Hide ${caption} Tab`
        : `Show ${caption} Tab`;
    },
    ucfirst(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    updateEmitter(status) {
      Object.entries(status).forEach(([panel, state]) => {
        this.states[panel] = state.show;
      });
      return this.states;
    },
    updateStatus(id) {
      // NOTE: leave the initial panelstates untouched! Configured by the project only!
      // original panelstates needed in resetPanelStatus() to look up the initial states,
      // which otherwise would be incidentally overwritten; hence: => *statecopy*
      const statecopy = this.panelstates;
      statecopy[this.togglekeys[id]].show = !statecopy[this.togglekeys[id]].show;

      this.$root.$emit('update-panel-status', this.updateEmitter(statecopy));
    },
  },
  created() {
    this.fasUndo = fasUndo;
    this.fasCircle = fasCircle;
    this.fasCheckCircle = fasCheckCircle;

    // just show the toggle buttons needed according to the config
    Object.entries(this.panelstates).forEach(([panel, state]) => {
      if (state.show === true) {
        this.togglekeys.push(panel);
      }
    });
  },
  mounted() {
    this.resetPanelStatus();

    this.$root.$on('update-item', () => {
      if (this.panelstates.image.show) {
        const [haskey, index] = this.keyExists('image', this.togglekeys);
        // check, if image key hasn't been deleted yet
        if (haskey && !this.imageurl) {
          this.togglekeys.splice(index, 1);
        } else if (!haskey && this.imageurl) {
          this.togglekeys.push('image');
        }
      }
    });
  },
};
</script>

<style lang="sass" scoped>
  button
    @media (min-width: 600px)
      margin-right: 8px
  button:last-of-type
    margin-right: 0
  .toggle-list
    > *
      align-items: center
</style>
