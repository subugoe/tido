<template>
  <div>
    <q-btn
      flat
      round
      :title="t('project_info')"
      @click="infobox = true"
      color="grey-6"
      :icon="infoIcon"
    >
    </q-btn>

    <q-dialog v-model="infobox">
      <div class="tido">
        <q-card>
          <q-card-section>
            <h2 class="text-h5 q-pb-md q-ma-none">TIDO</h2>
            <p class="text-weight-bold">{{ t('tido_description') }}</p>
            <p>Copyright (c) {{ actualYear }} {{ t('sub_info') }}</p>
            <p class="q-mb-none">Version {{ tidoVersion }}, {{ t('license') }}</p>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-btn
              dense
              flat
              href="https://gitlab.gwdg.de/subugoe/emo/tido/-/blob/main/README.md"
              target="_blank"
              type="a"
              :icon="docsIcon"
              :label="t('documentation')"
            />

            <q-btn
              dense
              flat
              href="https://gitlab.gwdg.de/subugoe/emo/tido/"
              target="_blank"
              type="a"
              :icon="codeIcon"
              :label="t('source_code')"
              class="q-mx-md"
            />

            <q-btn
              dense
              flat
              href="mailto:gitlab+subugoe-emo-tido-10921-issue-@gwdg.de"
              type="a"
              :icon="bugIcon"
              :label="t('report_a_bug')"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              v-close-popup
              :class="$q.dark.isActive ? 'text-white' : 'text-black'"
              flat
              :label="t('close')"
            />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import {
  biInfoLg, biBook, biCodeSlash, biBugFill,
} from '@quasar/extras/bootstrap-icons';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import packageInfo from '../../../package.json';

const { t } = useI18n();

const infobox = ref(false);
const tidoVersion = ref('');
const infoIcon = ref(null);
const docsIcon = ref(null);
const codeIcon = ref(null);
const bugIcon = ref(null);

const actualYear = computed(() => {
  const d = new Date();
  return d.getFullYear();
});

onBeforeMount(() => {
  tidoVersion.value = packageInfo.version;
  infoIcon.value = biInfoLg;
  docsIcon.value = biBook;
  codeIcon.value = biCodeSlash;
  bugIcon.value = biBugFill;
});

</script>
<style lang="scss">
.q-dialog {
  .tido {
    height: auto;
  }
}
</style>
