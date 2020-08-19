<template>

  <div class="col-xs-auto" title="Project info">
    <q-btn
      flat
      color="grey"
      label=""
      @click="infobox = true"
      >
      <q-icon size="xs" :name="fasInfoCircle" />
    </q-btn>

    <q-dialog v-model="infobox">
      <q-card>
        <q-card-section class="">
          <div class="text-h5 q-pb-md">EMo Viewer</div>

          <p class="text-weight-bold">
            Slim, easy to use and mobile-friendly text and image viewer
          </p>

          <p>Copyright (c) 2020 Göttingen University - Göttingen State and University Library</p>

          <p class="q-mb-none">
            Version 1.3.0, licensed under GNU Affero General Public License v3.0
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/blob/develop/README.md"
            target="_blank"
            type="a"
            >
            <q-icon :name="fasBook" size="md" class="q-pr-md" />
            Documentation
          </q-btn>

          <q-btn
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/Qviewer/"
            target="_blank"
            type="a"
            >
            <q-icon :name="fasCode" size="md" class="q-pr-md" />
            Source Code
          </q-btn>

          <q-btn
            flat
            href="mailto:gitlab+subugoe-emo-qviewer-10921-issue-@gwdg.de"
            type="a"
            >
            <q-icon :name="fasBug" size="md" class="q-pr-md" />
            Report a Bug
          </q-btn>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  fasInfoCircle,
  fasBug,
  fasCode,
  fasBook,
} from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Softwareinfo',
  data() {
    return {
      infobox: false,
    };
  },
  created() {
    this.fasInfoCircle = fasInfoCircle;
    this.fasBug = fasBug;
    this.fasCode = fasCode;
    this.fasBook = fasBook;
  },
};
</script>
