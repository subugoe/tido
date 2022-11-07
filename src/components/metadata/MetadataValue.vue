<template>
  <div class="metadata-value">
    <div
      v-for="(url, idx) in contentUrls"
      :key="idx"
      class="url-text"
      :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'"
    >
      <a
        v-if="url.isLink"
        :href="url.text"
        :title="url.linkTitle + '- open in a new tab or window'"
        rel="noopener noreferrer"
        target="_blank"
        class="content__link"
        :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
      >
        <span>{{ url.linkTitle }}</span>

        <q-icon
          name="bi-box-arrow-up-right"
          size="15px"
          class="q-pl-xs q-pb-xs"
        />
      </a>

      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <span v-else v-html="url.text" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetadataValue',
  props: {
    value: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    contentUrls() {
      let { value } = this;
      const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
      const urls = [...(value.match(regex) || [])];

      urls.forEach((url) => {
        value = value.replace(url, `_-_${url}_-_`);
      });

      const urlContents = value.split('_-_').filter((url) => url);

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
            filteredOutput.push({ isLink: true, linkTitle: urlText[i - 1]?.text.replace(')', '').replace(' (', ''), text: element.text });

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
};
</script>

<style lang="scss" scoped>
.content-urls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}

.content__link {
  display: flex;
  align-items: center;
  border-bottom: 1px var(--q-primary) dotted;
  text-decoration: none;

  @media (prefers-color-scheme: dark) {
    border-color: var(--q-white);
  }
}

.content__link {
  &:focus,
  &:hover,
  &:active {
    border-bottom-style: solid;
  }
}

.url-text {
  display: flex;
  padding-right: 4px;
}
</style>
