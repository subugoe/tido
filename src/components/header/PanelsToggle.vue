<template>
  <div class="panels-toggle relative-position">
    <template v-if="isMobile">
      <q-btn
        v-if="isMobile"
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
        class="dropdown-list t-shadow-md t-rounded-md dark:t-bg-gray-800 t-bg-gray-50"
      >
        <div v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="t-pl-1 t-py-none t-flex">
          <BaseCheckbox
            :model-value="show"
            @update:model-value="update(i, $event)"
          />
          <span>{{ $t(label) }}</span>
        </div>
        <div @click="reset" class="t-flex">
          <BaseIcon name="reset" :color="resetColor"></BaseIcon>
          <span :class="'text-' + resetColor">{{ $t('reset') }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="t-flex t-items-center t-space-x-4">
        <div v-for="({ show, label }, i) in toggles" :key="`toggle${i}`">
          <BaseCheckbox
            :model-value="show"
            @update:model-value="update(i, $event)"
            :id="`panel-toggle-${i}`"
            :round="true"
          />
          <label
            :title="handleToggleTitle(i)"
            :for="`panel-toggle-${i}`"
            class="t-ml-2 t-text-sm"
          >
            {{ $t(label) }}
          </label>
        </div>

        <BaseButton
          v-if="toggles.length > 0"
          :class="'text-' + resetColor"
          :title="$t('reset_view')"
          :text="$t('reset')"
          display="flat"
          icon="reset"
          @click="reset"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { isMobile } from '@/utils/is-mobile';
import BaseCheckbox from '@/components/base/BaseCheckbox.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';

const store = useStore();
const { t } = useI18n();

const toggles = ref([]);
const showDropdown = ref(false);

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
