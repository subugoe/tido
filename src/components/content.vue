<template>
  <div>
    <div class="row sticky">
      <div>
        <q-btn
          class="q-mr-sm q-mb-sm cursor-pointer"
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
          class="q-mr-sm q-mb-sm cursor-pointer"
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
    </div>
    <!-- FIXME: => 'v-html' directive can lead to XSS attack  vue/no-v-html

      Vue v1 supported triple braces to show html ({{{ ... }}}).
      This has been considered deprecated and isn't available anymore.
      Also Vue's directive "v-text" is considered deprecated (won't be available in v3).
      It represents text *as is* anyways and therefor isn't an alternative, since it would show html tags in the text.
      Atm there doesn't seem to be an alternative to "v-html" in regards to presenting xml/html.
    -->
    <div class="row">
      <div
        :id="nodeid"
        ref="contentsize"
        class="scroll-panel"
        v-html="content"
      />
    </div>
  </div>
</template>

<script>
import { fasSearchPlus, fasSearchMinus } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Content',
  props: {
    contenturl: {
      type: String,
      default: () => '',
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
  },
  data() {
    return {
      content: '',
      nodeid: '__text',
      sequenceindex: 0,
    };
  },
  watch: {
    fontsize() {
      this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;
    },
  },
  async created() {
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;

    this.content = await this.request(this.contenturl, 'text').then((data) => data);
  },
  mounted() {
    this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;

    this.$root.$on('update-sequence-index', (index) => {
      if (this.manifests[index].support) {
        this.manifests[index].support.map(this.getSupport);
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
    getSupport(obj) {
      if (obj.type === 'css') {
        this.request(obj.url, 'text')
          .then((data) => {
            const styleElement = document.createElement('style');

            styleElement.innerText = data.replace(
              /^|}|,/gm, (x) => x.concat('#', this.nodeid, ' '),
            );
            document.head.appendChild(styleElement);
          });
      }
    },
  },
};
</script>
