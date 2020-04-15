<template>
  <div class="" v-html="content"></div>
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
      });
  },
};
</script>
