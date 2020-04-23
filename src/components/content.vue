<template>
  <div v-html="content"></div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    itemurl: String,
    request: Function,
  },
  data() {
    return {
      content: '',
    };
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
  },
};
</script>

<style scoped>
div {
  margin: 16px;
}
</style>
