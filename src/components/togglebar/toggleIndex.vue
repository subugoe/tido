<template>
  <div>
    <ToggleFilter>
      <q-list>
        <q-item v-for="(name, idx) in togglekeys" :key="idx"
          class="bg-grey-2"
          clickable
          v-close-popup
          :aria-selected="toggleAria(idx)"
          :title="toggleTitle(idx)"
          @click="toggleIcon(idx); updateStatus(idx)"
          >
          <q-icon class="q-pr-xs q-mt-xs" size="xs" :name="toggleIcon(idx)" />
          <q-item-section>{{ panelstates[name].heading | capitalize }}</q-item-section>
        </q-item>

        <q-item
          class="bg-grey-5"
          clickable
          v-close-popup
          title="Reset panels to default view"
          @click="resetPanelStatus"
          >
          <q-icon class="q-pr-xs q-mt-xs" size="xs" :name="fasUndo" />
          <q-item-section>{{ 'Reset Panels' | capitalize }}</q-item-section>
        </q-item>
      </q-list>
    </ToggleFilter>
  </div>
</template>

<script>
import {
  fasUndo,
  fasCircle,
  fasCheckCircle,
} from '@quasar/extras/fontawesome-v5';

import ToggleFilter from '@/components/togglebar/toggleFilter.vue';

export default {
  name: 'ToggleIndex',
  props: {
    imageurl: String,
    panelstates: Object,
  },
  components: {
    ToggleFilter,
  },
  data() {
    return {
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
      // and leave the initial panel/s configured to be hidden (e.g. *false*) untouched!
      for (let idx = 0; idx < this.togglekeys.length; idx += 1) {
        this.panelstates[this.togglekeys[idx]].show = true;
      }
    },
    toggleAria(id) {
      return !!this.panelstates[this.togglekeys[id]].show;
    },
    toggleIcon(id) {
      return this.panelstates[this.togglekeys[id]].show ? fasCheckCircle : fasCircle;
    },
    toggleTitle(id) {
      const caption = this.ucfirst(this.panelstates[this.togglekeys[id]].heading);

      return this.panelstates[this.togglekeys[id]].show
        ? `Hide ${caption} Tab`
        : `Show ${caption} Tab`;
    },
    ucfirst(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    updateStatus(id) {
      this.panelstates[this.togglekeys[id]].show = !this.panelstates[this.togglekeys[id]].show;
    },
  },
  created() {
    this.fasUndo = fasUndo;
    this.fasCircle = fasCircle;
    this.fasCheckCircle = fasCheckCircle;

    const panels = Object.entries(this.panelstates).sort((a, b) => a[1].order - b[1].order);

    // just show the toggle buttons needed according to the config
    panels.forEach(([panel, state]) => {
      if (state.tab === true) {
        state.show = false;
      }
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
</style>
