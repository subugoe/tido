<template>
  <div class="panels-toggle t-relative">
    <template v-if="isMobile">
      <BaseDropdown
        v-model="showDropdown"
        :button-text="$t('show_hide_panels')"
      >
        <div v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="t-space-x-2 t-flex t-items-center t-mb-2">
          <BaseCheckbox
            :model-value="show"
            :id="`panel-toggle-${i}`"
            @update:model-value="update(i, $event)"
          />
          <label class="t-text-nowrap" :for="`panel-toggle-${i}`">{{ $t(label) }}</label>
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
      </BaseDropdown>
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
import BaseDropdown from '@/components/base/BaseDropdown.vue';
import { useConfigStore } from '@/stores/config';

const store = useStore();
const configStore = useConfigStore()
const { t } = useI18n();

const toggles = ref([]);
const showDropdown = ref(false);
const panels = computed(() => configStore.config.panels  );  //store.getters['config/config'].panels);
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

function update(index, show) {
  const configStore = useConfigStore()
  if (show === false) {
    let numberClosedPanels = 0;
    // count the number of closed panels, except the current action
    for (let i = 0; i < toggles.value.length; i += 1) {
      if (i !== index) {
        if (toggles.value[i].show === false) {
          numberClosedPanels += 1;
        }
      }
    }

    // Keep showing the last panel after closing it - So that we can show at least one panel always
    // When n_panels - 1 are closed and the current action is "close", then keep open this panel
    if (numberClosedPanels === toggles.value.length - 1) {
      show = true;
    }
  }

  toggles.value[index].show = show;
  configStore.setShowPanel({ index, show })
}

function reset() {
  const configStore = useConfigStore()
  toggles.value.forEach((toggle, index) => {
    toggles.value[index].show = true;
    configStore.setShowPanel({ index, show: true })
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