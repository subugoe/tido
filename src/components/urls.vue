<template>
  <div class="content-urls">
    <div
      v-for="(url, idx) in contentUrls"
      :key="idx"
      class="url-text"
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

      const urlText = urlContents.map((urlContent) => ({
        text: urlContent,
        isLink: urls.includes(urlContent),
      }));

      if (urls.length) {
        const filteredOutput = [];
        let i = 0;

        while (i < urlText.length) {
          const element = urlText[i];

          // This first if condition logic checks the string that we get from backend.
          // Ex text: Max Mustermann (https://d-nb.info/gnd/1143543866).
          // Here the text is divided into 3 parts of array which takes text from previous element(Max Mustermann ( ),
          // link from next element(https://d-nb.info/gnd/1143543866) and than the last ) is skipped.
          if ((urlText[i - 1]?.text || '').endsWith('(') && (urlText[i + 1]?.text || '').endsWith(')') && element.isLink) {
            filteredOutput.push({ isLink: true, linkTitle: urlText[i - 1]?.text.replace(')', '').replace('(', ''), text: element.text });

            i += 1;
          } else if (element.isLink || !(urlText[i + 1]?.isLink && element.text.endsWith('('))) {
          // it checks if it's a normal link or current text ends with ( and next item is link.
            const linkTitle = element.text.split('/').filter((link) => link);

            filteredOutput.push({ ...element, linkTitle: linkTitle[linkTitle.length - 1] });
          }
          i += 1;
        }

        return filteredOutput;
      }

      return urlText;
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

.url-text {
  display: inline-block;
}
</style>
