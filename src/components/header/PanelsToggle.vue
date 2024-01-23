<template>
  <div class="panels-toggle relative-position">
    <q-btn
      v-if="$q.screen.width < 1200"
      :icon-right="dropdownIcon"
      :label="$t('show_hide_panels')"
      outline
      flat
      size="12px"
      @click="showDropdown = !showDropdown"
    >
    </q-btn>
    <div
      v-if="showDropdown"
      class="dropdown-list shadow-2 rounded-borders"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'"
    >
      <q-list>
        <q-item v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="t-pl-1 t-py-none" tag="label" v-ripple>
          <q-item-section side>
            <q-checkbox
              :model-value="show"
              @update:model-value="update(i, $event)"
              :checked-icon="checkedIcon"
              :unchecked-icon="uncheckedIcon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t(label) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple @click="reset">
          <q-item-section side>
            <q-icon :name="resetIcon" :color="resetColor"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label :class="'text-' + resetColor">{{ $t('reset') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="$q.screen.width > 1199" class="row items-center">
      <div v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="q-px-1">
        <q-checkbox
          :model-value="show"
          @update:model-value="update(i, $event)"
          class="q-px-2 text-body2"
          :title="handleToggleTitle(i)"
          :label="$t(label)"
          dense
          size="xs"
          :checked-icon="checkedIcon"
          :unchecked-icon="uncheckedIcon"
        >
        </q-checkbox>
      </div>

      <q-btn
        v-if="toggles.length > 0"
        flat
        no-caps
        dense
        class="q-px-2 q-py-none reset-btn"
        :class="'text-' + resetColor"
        :title="$t('reset_view')"
        @click="reset"
        :icon="resetIcon"
        :color="resetColor"
      >
        <span>{{ $t('reset') }}</span>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import {
  biCheckCircleFill,
  biCircle,
  biArrowCounterclockwise,
  biChevronDown,
} from '@quasar/extras/bootstrap-icons';

const store = useStore();
const { t } = useI18n();

const toggles = ref([]);
const showDropdown = ref(false);

const checkedIcon = biCheckCircleFill;
const uncheckedIcon = biCircle;
const resetIcon = biArrowCounterclockwise;
const dropdownIcon = biChevronDown;

const panels = computed(() => store.getters['config/config'].panels);
const resetColor = computed(() => (toggles.value.filter(({ show }) => !show).length > 0 ? 'primary' : 'grey-7'));

watch(
  panels,
  (value) => {
    toggles.value = value
      .filter(({ toggle }) => toggle === true)
      .map(({ show, label }, index) => ({ index, show, label }));
  },
  { immediate: true },
);

watch(
  showDropdown,
  (value) => {
    const tido = document.getElementById('tido');
    let backdrop = tido.querySelector('#tido-backdrop');
    if (value) {
      if (!backdrop) {
        const el = document.createElement('div');
        el.id = 'tido-backdrop';
        tido.appendChild(el);
        backdrop = tido.querySelector('#tido-backdrop');
        backdrop.clickOutsideEvent = () => {
          showDropdown.value = false;
        };
        backdrop.addEventListener('click', backdrop.clickOutsideEvent);
      }
    } else if (backdrop) backdrop.remove();
  },
);

function update(index, show) {
  toggles.value[index].show = show;
  store.dispatch('config/setShowPanel', { index, show });
}

function reset() {
  toggles.value.forEach((toggle, index) => {
    toggles.value[index].show = true;
    store.dispatch('config/setShowPanel', { index, show: true });
  });
}

// display toggle title when hovering
function handleToggleTitle(idx) {
  const titleName = t(toggles.value[idx].label);
  const titleUpper = `${titleName[0].toUpperCase()}${titleName.slice(1)}`;

  return toggles.value[idx].show
    ? `${t('hide')} ${titleUpper} Panel`
    : `${t('show')} ${titleUpper} Panel`;
}
</script>

<style lang="scss">
.dropdown-list {
  position: absolute;
  z-index: 1000;
  top: calc(100% + 0.5rem);
  right: 0;
}
.reset-btn .q-icon {
  font-size: 1.2rem;
  padding-right: 0.5rem;
}

.panels-toggle.col {
  width: unset !important;
  padding: unset !important;
}

:deep(.q-checkbox) {
  flex-shrink: unset !important;
  width: unset !important;
  max-width: unset !important;
}

.q-btn .q-icon.on-right {
  margin-left: 12px;
}
</style>
