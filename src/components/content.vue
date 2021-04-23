<template>
  <div class="item">
    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey q-mb-sm"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
      narrow-indicator
    >
      <q-tab
        v-for="(contenturl, i) in contenturls"
        :key="`content${i}`"
        :name="contenturl"
        :class="contenturls.length == 1 && 'default-cursor'"
        :disable="contenturls.length == 1"
        :label="contenttypes[i]"
      />
    </q-tabs>

    <div class="q-px-sm">
      <q-btn
        class="cursor-pointer"
        flat
        round
        size="sm"
        title="Increase Textsize"
        @click="increase()"
      >
        <q-icon
          :name="fasSearchPlus"
          size="xs"
          :color="$q.dark.isActive ? 'white' : 'accent'"
        />
      </q-btn>

      <q-btn
        class="cursor-pointer"
        flat
        round
        size="sm"
        title="Decrease Textsize"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        @click="decrease()"
      >
        <q-icon
          :name="fasSearchMinus"
          size="xs"
          :color="$q.dark.isActive ? 'white' : 'accent'"
        />
      </q-btn>
    </div>

    <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
    <div
      :class="['item-content', config.rtl ? 'rtl' : '']"
      ref="contentsize"
      v-html="content"
    />

    <KeyDialog class="key-button" :map="availableClasses" />
  </div>
</template>

<script>
import { fasSearchPlus, fasSearchMinus } from '@quasar/extras/fontawesome-v5';
import { getClasses } from '@/components/textstyles/highlights.js';
import KeyDialog from '@/components/textstyles/keysdialog.vue';

export default {
  name: 'Content',
  components: { KeyDialog },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    contenturls: {
      type: Array,
      default: () => [],
    },
    contenttypes: {
      type: Array,
      default: () => [],
    },
    fontsize: {
      type: Number,
      default: () => 14,
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    request: {
      type: Function,
      default: null,
    },
    transcription: {
      type: String,
      default: () => '',
    },
  },
  data: () => ({
    activeTab: null,
    availableClasses: {},
    content: '',
    sequenceindex: 0,
    status: false,
  }),
  computed: {
    supportType() {
      const { support } = this.manifests[this.sequenceindex];

      return Object.keys(support).length && support.url !== '';
    },
  },

  watch: {
    fontsize() {
      this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;
    },
    activeTab(url) {
      this.request(url, 'text').then((data) => {
        this.availableClasses = getClasses(data);

        if (this.supportType) {
          this.getSupport(this.manifests[0].support);
        }

        this.content = data;
      });
    },
  },
  async created() {
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;

    const [contentUrl] = this.contenturls;

    this.activeTab = contentUrl;
  },

  mounted() {
    this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;

    this.$root.$on('update-sequence-index', (index) => {
      if (this.supportType) {
        this.getSupport(this.manifests[index].support);
      }
    });
  },
  methods: {
    decrease() {
      const min = 8;
      let textsize = this.fontsize;

      textsize -= textsize > min ? 1 : 0;
      this.$root.$emit('update-fontsize', textsize);
    },
    increase() {
      const max = 32;
      let textsize = this.fontsize;

      textsize += textsize < max ? 1 : 0;
      this.$root.$emit('update-fontsize', textsize);
    },
    getSupport(support) {
      support.forEach((s) => {
        this.request(s.url, 'text')
          .then(() => {
            const supportUrl = document.createElement('link');

            if (s.type === 'css') supportUrl.setAttribute('rel', 'stylesheet');

            supportUrl.setAttribute('href', s.url);

            document.head.appendChild(supportUrl);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.default-cursor {
  cursor: default !important;
}

.item-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: scroll;
  padding: 8px;
}

.key-button {
  display: flex;
  flex-flow: column;
  padding-top: 8px;
}

.rtl {
  direction: rtl;
}
</style>
