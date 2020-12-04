<template>
  <div class="col-xs-auto">
    <q-btn
      flat
      label=""
      title="Project Info"
      @click="infobox = true"
    >
      <q-icon
        size="xs"
        :name="fasInfoCircle"
      />
    </q-btn>

    <q-dialog v-model="infobox">
      <q-card>
        <q-card-section>
          <h1 class="text-h5 q-pb-md">
            TIDO
          </h1>

          <p class="text-weight-bold">
          Text vIewer for Digital Objects
          </p>

          <p>Copyright (c) 2020 Göttingen University - Göttingen State and University Library</p>

          <p class="q-mb-none">
            Version {{ version }}, licensed under GNU Affero General Public License v3.0
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/blob/main/README.md"
            target="_blank"
            type="a"
          >
            <q-icon
              :name="fasBook"
              size="md"
              class="q-pr-md"
            />
            Documentation
          </q-btn>

          <q-btn
            flat
            href="https://gitlab.gwdg.de/subugoe/emo/Qviewer/"
            target="_blank"
            type="a"
          >
            <q-icon
              :name="fasCode"
              size="md"
              class="q-pr-md"
            />
            Source Code
          </q-btn>

          <q-btn
            flat
            href="mailto:gitlab+subugoe-emo-qviewer-10921-issue-@gwdg.de"
            type="a"
          >
            <q-icon
              :name="fasBug"
              size="md"
              class="q-pr-md"
            />
            Report a Bug
          </q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            :class="$q.dark.isActive ? 'text-white' : 'text-black'"
            flat
            label="Close"
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
  fasInfoCircle,
} from '@quasar/extras/fontawesome-v5';
import { version } from '../../package.json';

export default {
  name: 'Softwareinfo',
  data() {
    return {
      infobox: false,
      version: '',
    };
  },
  created() {
    this.fasBook = fasBook;
    this.fasBug = fasBug;
    this.fasCode = fasCode;
    this.fasInfoCircle = fasInfoCircle;

    this.version = version;
  },
};
</script>
