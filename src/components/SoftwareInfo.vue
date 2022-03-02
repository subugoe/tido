<template>
  <div class="col-xs-auto">
    <q-btn
      flat
      label=""
      :title="$t('projectInfo')"
      @click="infobox = true"
    >
      <q-icon
        size="xs"
        :name="fasInfo"
        :color="$q.dark.isActive ? 'bg-black' : 'accent'"
      />
    </q-btn>

    <q-dialog v-model="infobox">
      <q-card>
        <q-card-section>
          <h1 class="text-h5 q-pb-md">
            TIDO
          </h1>

          <p class="text-weight-bold">
            {{ $t('infoDescription') }}
          </p>

          <p>Copyright (c) {{ actualYear }} {{ $t('infoCopyright') }}</p>

          <p class="q-mb-none">
            Version {{ version }}, {{ $t('infoLicense') }}
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/tido/-/blob/main/README.md"
            target="_blank"
            type="a"
          >
            <q-icon
              :name="fasBook"
              size="md"
              class="q-pr-md"
            />
            {{ $t('infoDocs') }}
          </q-btn>

          <q-btn
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/tido/"
            target="_blank"
            type="a"
          >
            <q-icon
              :name="fasCode"
              size="md"
              class="q-pr-md"
            />
            {{ $t('infoSourcecode') }}
          </q-btn>

          <q-btn
            flat
            href="mailto:gitlab+subugoe-emo-tido-10921-issue-@gwdg.de"
            type="a"
          >
            <q-icon
              :name="fasBug"
              size="md"
              class="q-pr-md"
            />
            {{ $t('infoBugs') }}
          </q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            :class="$q.dark.isActive ? 'text-white' : 'text-black'"
            flat
            :label="$t('infoClose')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  fasBook,
  fasBug,
  fasCode,
  fasInfo,
} from '@quasar/extras/fontawesome-v5';
import { version } from '../../package.json';

export default {
  name: 'SoftwareInfo',
  data() {
    return {
      infobox: false,
      version: '',
    };
  },
  computed: {
    actualYear() {
      const d = new Date();
      return d.getFullYear();
    },
  },
  created() {
    this.fasBook = fasBook;
    this.fasBug = fasBug;
    this.fasCode = fasCode;
    this.fasInfo = fasInfo;

    this.version = version;
  },
};
</script>
