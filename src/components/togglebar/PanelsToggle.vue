<template>
  <div>
    <q-btn-dropdown
      v-if="$q.screen.width < 1200"
      :dropdown-icon="fasCaretDown"
      outline
      flat
      size="12px"
      padding="xs"
      class="button__dropdown q-px-sm"
      :class="$q.dark.isActive ? 'bg-black' : 'bg-secondary text-black'"
      :label="$t('showHidePanels')"
    >
      <q-list
        v-for="(p, i) in panels"
        :key="`toggle${i}`"
      >
        <q-item
          v-if="p.toggle"
          clickable
          padding="xs"
          :title="handleToggleTitle(i)"
          @click="() => handleStatusPanel(i)"
        >
          <q-item-section>
            <q-item-label>
              <q-icon
                class="q-pr-xs"
                size="xs"
                :color="$q.dark.isActive ? 'bg-black' : 'accent'"
                :name="renderCheckIcon(i)"
              />
              {{ $t(p.panel_label).toUpperCase() }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list>
        <q-item
          v-if="toggleCounter"
          v-close-popup
          clickable
          padding="xs"
          :title="$t('defaultView')"
          @click="()=> handleStatusPanel(-1, true)"
        >
          <q-item-section>
            <q-item-label>
              <q-icon
                class="q-pr-xs"
                size="xs"
                :color="$q.dark.isActive ? 'white' : 'accent'"
                :name="fasUndo"
              />
              {{ $t('Reset').toUpperCase() }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <div
      v-if="$q.screen.width > 1199"
      class="row"
    >
      <div
        v-for="(p, i) in panels"
        :key="`toggle${i}`"
      >
        <q-btn
          v-if="p.toggle"
          v-close-popup
          clickable
          flat
          size="12px"
          padding="xs"
          class="q-px-sm"
          :title="handleToggleTitle(i)"
          @click="() => handleStatusPanel(i)"
        >
          <q-icon
            class="q-pr-xs"
            size="16px"
            :color="$q.dark.isActive ? 'bg-black' : 'accent'"
            :name="renderCheckIcon(i)"
          />
          {{ $t(p.panel_label).toUpperCase() }}
        </q-btn>
      </div>

      <q-btn
        v-if="toggleCounter"
        v-close-popup
        clickable
        flat
        size="12px"
        padding="xs"
        class="q-px-sm"
        :title="$t('defaultView')"
        @click="()=> handleStatusPanel(-1, true)"
      >
        <q-icon
          class="q-pr-xs"
          size="16px"
          :color="$q.dark.isActive ? 'white' : 'accent'"
          :name="fasUndo"
        />
        {{ $t('Reset').toUpperCase() }}
      </q-btn>
    </div>
  </div>
</template>

<script>
import {
  fasUndo,
  fasCircle,
  fasCheckCircle,
  fasCaretDown,
} from '@quasar/extras/fontawesome-v5';

export default {
  name: 'PanelsToggle',
  props: {
    panels: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    toggleCounter() {
      const toggleCount = this.panels.filter((panel) => panel.toggle === true);
      return toggleCount.length > 0;
    },
  },
  created() {
    this.fasCheckCircle = fasCheckCircle;
    this.fasCircle = fasCircle;
    this.fasUndo = fasUndo;
    this.fasCaretDown = fasCaretDown;
  },
  methods: {
    // show checkbox icon depending on the current status
    renderCheckIcon(idx) {
      return this.panels[idx].show ? fasCheckCircle : fasCircle;
    },
    // Control status (show) panel / even you can reset all
    handleStatusPanel(i, reset = false) {
      const updatedPanel = this.panels.map((obj, idx) => {
        if (reset) return { ...obj, show: true };

        return i === idx ? { ...obj, show: !obj.show } : obj;
      });
      this.$root.$emit('panels-position', updatedPanel);
    },
    // display toggle title when hovering
    handleToggleTitle(idx) {
      const titleName = this.$t(this.panels[idx].panel_label);
      const titleUpper = `${titleName[0].toUpperCase()}${titleName.slice(1)}`;

      return this.panels[idx].show
        ? `${this.$t('hide')} ${titleUpper} Panel`
        : `${this.$t('show')} ${titleUpper} Panel`;
    },
  },
};
</script>
