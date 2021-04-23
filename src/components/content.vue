<template>
  <div class="panel">
    <q-tabs
      v-model="activeTab"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
      class="text-grey q-mb-sm"
      dense
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
      narrow-indicator
    >
      <q-tab
        v-for="(contenturl, i) in contenturls"
        :key="`content${i}`"
        :class="contenturls.length == 1 && 'default-cursor'"
        :disable="contenturls.length == 1"
        :label="contenttypes[i]"
        :name="contenturl"
      />
    </q-tabs>

    <div class="q-px-sm">
      <q-btn
        v-for="(button, index) in buttons"
        :key="index"
        class="q-mr-sm q-mb-sm cursor-pointer"
        flat
        round
        size="md"
        :title="button.title"
        @click="dynamicEvent(button.event)"
      >
        <q-icon
          :color="$q.dark.isActive ? 'white' : 'accent'"
          :name="button.icon"
          size="sm"
        />
      </q-btn>
    </div>

    <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
    <div
      :class="['panel-content', config.rtl ? 'rtl' : '']"
      ref="contentsize"
      v-html="content"
    />
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
      default: () => 16,
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    request: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      activeTab: null,
      buttons: [
        { event: 'increase', icon: fasSearchPlus, title: 'Increase Textsize' },
        { event: 'decrease', icon: fasSearchMinus, title: 'Decrease Textsize' },
      ],
      content: '',
      sequenceindex: 0,
    };
  },
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
        if (this.supportType) {
          this.getSupport(this.manifests[0].support);
        }

        this.content = data;
      });

      this.$root.$emit('update-content');
    },
  },
  async created() {
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
    dynamicEvent(event) {
      this[event]();
    },
    decrease() {
      const min = 12;
      let textsize = this.fontsize;

      textsize -= textsize > min ? 4 : 0;
      this.$root.$emit('update-fontsize', textsize);
    },
    increase() {
      const max = 24;
      let textsize = this.fontsize;

      textsize += textsize < max ? 4 : 0;
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

.panel-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: scroll;
  overflow-x: hidden;
  padding: 8px;
}

.rtl {
  direction: rtl;
}
</style>
