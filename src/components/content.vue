<template>
  <div class="item relative-position">
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

    <div>
      <q-btn
        class="cursor-pointer"
        flat
        round
        size="md"
        title="Increase Textsize"
        @click="increase()"
      >
        <q-icon
          :name="fasSearchPlus"
          size="sm"
          :color="$q.dark.isActive ? 'white' : 'accent'"
        />
      </q-btn>

      <q-btn
        class="cursor-pointer"
        flat
        round
        size="md"
        title="Decrease Textsize"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        @click="decrease()"
      >
        <q-icon
          :name="fasSearchMinus"
          size="sm"
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

    <q-inner-loading :showing="loadingprogress">
      <q-spinner
        size="3em"
        color="primary"
      />

      <div class="q-pt-md text-uppercase">
        Loading, please wait....
      </div>
    </q-inner-loading>
  </div>
</template>

<script>
import { fasSearchPlus, fasSearchMinus } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Content',
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
    loadingprogress: {
      type: Boolean,
    },
  },
  data: () => ({
    activeTab: null,
    content: '',
    sequenceindex: 0,
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
    async activeTab(url) {
      this.$root.$emit('textloading', true);

      const data = await this.request(url, 'text');

      if (this.supportType) this.getSupport(this.manifests[0].support);

      this.content = data;

      this.$root.$emit('textloading', false);
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
  .rtl {
    direction: rtl;
  }

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
</style>
