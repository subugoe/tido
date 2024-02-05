<template>
  <div>
    <BaseButton
      display="flat"
      rounded
      :title="$t('project_info')"
      @click="infobox = true"
      icon="info"
    >
    </BaseButton>

    <Dialog v-model="infobox" closable>

      <h2 class="text-h5 t-pb-4 t-ma-none">TIDO</h2>
      <p class="text-weight-bold">{{ $t('tido_description') }}</p>
      <p>Copyright (c) {{ actualYear }} {{ $t('sub_info') }}</p>
      <p class="t-mb-none">Version {{ tidoVersion }}, {{ $t('license') }}</p>

      <div class="t-pt-none">
        <BaseButton
          display="flat"
          size="small"
          href="https://gitlab.gwdg.de/subugoe/emo/tido/-/blob/main/README.md"
          target="_blank"
          type="a"
          icon="docsIcon"
          :label="$t('documentation')"
        />

        <BaseButton
          dense
          flat
          href="https://gitlab.gwdg.de/subugoe/emo/tido/"
          target="_blank"
          type="a"
          icon="codeIcon"
          :label="$t('source_code')"
          class="t-mx-4"
        />

        <BaseButton
          dense
          flat
          href="mailto:gitlab+subugoe-emo-tido-10921-issue-@gwdg.de"
          type="a"
          icon="bugIcon"
          :label="$t('report_a_bug')"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import packageInfo from '../../../package.json';
import BaseButton from '@/components/base/BaseButton.vue';

const infobox = ref(false);

const tidoVersion = packageInfo.version;
// const infoIcon = biInfoLg;
// const docsIcon = biBook;
// const codeIcon = biCodeSlash;
// const bugIcon = biBugFill;

const actualYear = computed(() => {
  const d = new Date();
  return d.getFullYear();
});
</script>

<style lang="scss">
</style>
