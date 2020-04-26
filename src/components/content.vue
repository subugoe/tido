<template>
  <div :id="nodeid" v-html="content"></div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    contenturl: String,
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
div {
  margin: 16px;
}
</style>
