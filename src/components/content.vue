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

    <!-- FIXME: remove inline style -->
    <!-- FIXME: Current implementations in most browsers will remove from the accessibility tree any element with a display value of contents (but descendants will remain). This will cause the element itself to no longer be announced by screen reading technology. https://developer.mozilla.org/en-US/docs/Web/CSS/display#Accessibility_concerns -->
    <div class="row" style="display: contents;">
      <!-- FIXME: remove inline style -->
      <div
        class="scroll-panel"
        :id="nodeid"
        :style="`font-size: ${fontsize}px`"
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
    contenturl: String,
    fontsize: Number,
    manifests: Array,
    request: Function,
  },
  data() {
    return {
      content: '',
      nodeid: '__text',
      sequenceindex: 0,
    };
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
  async created() {
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;

    this.content = await this.request(this.contenturl, 'text').then((data) => data);
  },
  mounted() {
    this.$root.$on('update-sequence-index', (index) => {
      if (this.manifests[index].support) {
        this.manifests[index].support.map(this.getSupport);
      }
    });
  },
};
</script>
