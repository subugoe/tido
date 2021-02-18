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

    <div class="row">
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <div
        :class="['scroll-panel', config.rtl ? 'rtl' : '']"
        :id="nodeid"
        ref="contentsize"
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
    config: {
      type: Object,
      default: () => {},
    },
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
    const pNames = document.getElementsByClassName('persName');

    Object.values(pNames).map((name) => name.classList.add('personName'));

    // Object.values(pNames).forEach((item) => {
    //   // eslint-disable-next-line no-console
    //   console.log(item);
    //   item.style.color = 'red';
    // });

    this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;

    this.$root.$on('update-sequence-index', (index) => {
      if (this.manifests[index].support && this.sequenceindex !== index) {
        // this.getSupport(this.manifests[index].support);
      }
    });

    this.$root.$on('update-item', () => {
      const personNames = document.getElementsByClassName('persName');

      Object.values(personNames).forEach((item) => {
        // eslint-disable-next-line no-console
        console.log(item);
        item.style.color = 'red';
      });
      // const ids = Object.values(personNames).filter((name) => this.annotationIds.includes(name.id));
      // ids.forEach((id) => id.classList.add('personName'));
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
      if (support.type === 'css') {
        this.request(support.url, 'text')
          .then((data) => {
            const styleElement = document.createElement('style');

            styleElement.innerText = data.replace(
              /^|}|,/gm, (x) => x.concat('#', this.nodeid, ' '),
            );
            document.head.appendChild(styleElement);
          })
          .catch((e) => {
            this.$q.notify({ message: `${e.name}: ${e.message}` });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .rtl {
    direction: rtl;
  }
  .personName {
    color: red;
  }
</style>
