<template>
  <div class="content-urls">
    <div
      v-for="(url, idx) in contentUrls"
      :key="idx"
      style="display: inline-block;"
    >
      <a
        v-if="url.isLink"
        :href="url.text"
        :title="url.linkTitle + '- open in a new tab or window'"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{{ url.linkTitle }}</span>

        <q-icon
          :name="fasExternalLinkAlt"
          size="12px"
          class="q-pl-xs"
        />
      </a>

      <span v-else>{{ url.text }}</span>
    </div>
  </div>
</template>

<script>
import { fasExternalLinkAlt } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'ContentUrls',
  props: {
    content: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    contentUrls() {
      let { content } = this;
      const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
      const urls = [...(content.match(regex) || [])];

      urls.forEach((url) => {
        content = content.replace(url, `_-_${url}_-_`);
      });

      const urlContents = content.split('_-_').filter((url) => url);

      return urlContents.map((urlContent) => {
        const isLink = urls.includes(urlContent);
        let linkTitle = '';

        if (isLink) {
          const linkText = urlContent.split('/').filter((link) => link);

          linkTitle = linkText[linkText.length - 1];
        }

        return {
          text: urlContent,
          isLink,
          linkTitle,
        };
      });
    },
  },
  created() {
    this.fasExternalLinkAlt = fasExternalLinkAlt;
  },
};
</script>

<style lang="scss" scoped>
.content-urls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}
</style>
