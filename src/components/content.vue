<template>
  <div style="margin: 16px;">
    <q-btn
      class="q-mr-sm q-mb-sm cursor-pointer"
      color="grey-8"
      round
      flat
      size="md"
      >
      <q-icon
        size="sm"
        :name="fasSearchPlus"
        title="Increase"
        @click="increase()"
      />
    </q-btn>
    <q-btn
      class="q-mr-sm q-mb-sm cursor-pointer"
      color="grey-8"
      round
      flat
      size="md"
      >
      <q-icon
        size="sm"
        :name="fasSearchMinus"
        title="Decrease"
        @click="decrease()"
      />
    </q-btn>

  <div class="content" :style="`font-size: ${fontsize}px`" :id="nodeid" v-html="content"></div>
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
      this.$root.$emit('change-fontsize', textsize);
    },
    increase() {
      const max = 32;
      let textsize = this.fontsize;

      textsize += textsize < max ? 1 : 0;
      this.$root.$emit('change-fontsize', textsize);
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

<style scoped>
.content {
  margin: 16px;
}
</style>
