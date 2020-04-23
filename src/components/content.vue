<template>
  <div :id="nodeid" v-html="content"></div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    itemurl: String,
    manifests: Array,
    request: Function,
  },
  data() {
    return {
      content: '',
      nodeid: '__text',
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
  created() {
    this.request(this.itemurl)
      .then((data) => {
        this.request(data.content, 'text')
          .then((content) => {
            this.content = content;
          });
      })
      .catch(() => {
        // nested async request. promise is pending, so JSON_parse fails
      });

    // this.manifests[index].support.map(this.getSupport);
  },
};
</script>

<style scoped>
div {
  margin: 16px;
}
</style>
