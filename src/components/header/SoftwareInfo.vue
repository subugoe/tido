<template>
  <div>
    <BaseButton
      display="flat"
      rounded
      :title="$t('project_info')"
      @click="infobox = true"
      icon="info"
      class="t-text-gray-400 hover:t-text-gray-500"
    >
    </BaseButton>

    <BaseDialog v-model="infobox" closable>
      <div class="t-flex t-space-x-2 t-items-baseline t-mb-2">
        <h2 class="t-text-xl t-font-bold">TIDO</h2>
        <p class="t-text-gray-600">v{{ tidoVersion }}</p>
      </div>
      <p class="t-mb-4">{{ $t('tido_description') }}</p>
      <p>{{ $t('license') }}</p>
      <p class="t-mb-4">Copyright (c) {{ actualYear }} {{ $t('sub_info') }}</p>

      <div class="t-flex t-space-x-2">
        <a href="https://gitlab.gwdg.de/subugoe/emo/tido/-/blob/main/README.md" target="_blank">
          <BaseButton
            display="flat"
            icon="book"
            :text="$t('documentation')"
            size="small"
          />
        </a>

        <a href="https://gitlab.gwdg.de/subugoe/emo/tido/" target="_blank">
          <BaseButton
            display="flat"
            icon="code"
            :text="$t('source_code')"
            size="small"
          />
        </a>

        <a href="mailto:gitlab+subugoe-emo-tido-10921-issue-@gwdg.de" target="_blank">
          <BaseButton
            display="flat"
            size="small"
            href="mailto:gitlab+subugoe-emo-tido-10921-issue-@gwdg.de"
            icon="bug"
            :text="$t('report_a_bug')"
          />
        </a>
      </div>
    </BaseDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import packageInfo from '../../../package.json';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseDialog from '@/components/base/BaseDialog.vue';

const infobox = ref(false);

const tidoVersion = packageInfo.version;

const actualYear = computed(() => {
  const d = new Date();
  return d.getFullYear();
});
</script>

<style lang="scss">
</style>
