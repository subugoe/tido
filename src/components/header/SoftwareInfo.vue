<template>
  <div>
    <q-btn
      flat
      round
      :title="$t('project_info')"
      @click="infobox = true"
      color="grey-5"
      :icon="infoIcon"
    >
    </q-btn>

    <q-dialog v-model="infobox">
      <q-card id="tido">
        <q-card-section>
          <h1 class="text-h5 q-pb-md">TIDO</h1>
          <p class="text-weight-bold">{{ $t('tido_description') }}</p>
          <p>Copyright (c) {{ actualYear }} {{ $t('sub_info') }}</p>
          <p class="q-mb-none">Version {{ tidoVersion }}, {{ $t('license') }}</p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn
            dense
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/tido/-/blob/main/README.md"
            target="_blank"
            type="a"
            :icon="docsIcon"
            :label="$t('documentation')"
          />

          <q-btn
            dense
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/tido/"
            target="_blank"
            type="a"
            :icon="codeIcon"
            :label="$t('source_code')"
            class="q-mx-md"
          />

          <q-btn
            dense
            flat
            href="mailto:gitlab+subugoe-emo-tido-10921-issue-@gwdg.de"
            type="a"
            :icon="bugIcon"
            :label="$t('report_a_bug')"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            :class="$q.dark.isActive ? 'text-white' : 'text-black'"
            flat
            :label="$t('close')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  biInfoLg, biBook, biCodeSlash, biBugFill,
} from '@quasar/extras/bootstrap-icons';
import packageInfo from '../../../package.json';

export default {
  name: 'SoftwareInfo',
  data() {
    return {
      infobox: false,
      tidoVersion: '',
    };
  },
  computed: {
    actualYear() {
      const d = new Date();
      return d.getFullYear();
    },
  },
  created() {
    this.tidoVersion = packageInfo.version;
    this.infoIcon = biInfoLg;
    this.docsIcon = biBook;
    this.codeIcon = biCodeSlash;
    this.bugIcon = biBugFill;
  },
};
</script>
