<template>
  <div class="content-urls">
    <div
      v-for="(url, idx) in contentUrls"
      :key="idx"
      class="url-text"
    >
      <a
        v-if="url.isLink"
        :href="url.url"
        :title="url.linkTitle + '- open in a new tab or window'"
        rel="noopener noreferrer"
        target="_blank"
        class="content__link"
        :class="$q.dark.isActive ? 'text-white' : 'text-accent'"
      >
        <span>{{ url.linkTitle }}</span>

        <q-icon
          :name="fasExternalLinkAlt"
          size="12px"
          class="content__link-icon q-pl-xs"
        />
      </a>

      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <span v-else v-html="url.linkTitle" />
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
      let i = 0;
      const output = [];
      const roundBracketRegex = new RegExp(/\((.*?)\)/);
      const texts = this.content.split(' ');
      const urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%+.~#?&//=]*)/);

      while (i < texts.length) {
        let nextWord = texts[i + 1] || '';
        let text = texts[i];
        const isCurrentWordUrl = text.match(urlRegex);
        const isNextWordUrl = nextWord.match(urlRegex);

        if (text.match(roundBracketRegex)) {
          if (!text.match(urlRegex) && isNextWordUrl) {
            text = this.cleanWord(text);
            nextWord = this.cleanWord(nextWord);
            i += 1;
            texts.splice(i + 1, 1);

            output.push({
              isLink: true,
              linkTitle: text.split('/').slice(-1)[0] || '',
              url: nextWord,
            });
          } else if (text.match(urlRegex)) {
            text = this.cleanWord(text);

            output.push({
              isLink: true,
              linkTitle: text.split('/').slice(-1)[0] || '',
              url: text,
            });
          }
        } else if (isCurrentWordUrl) {
          text = this.cleanWord(text);

          output.push({
            isLink: true,
            linkTitle: text.split('/').slice(-1)[0] || '',
            url: text,
          });
        } else {
          output.push({ linkTitle: text });
        }
        i += 1;
      }

      return output;
    },
  },
  created() {
    this.fasExternalLinkAlt = fasExternalLinkAlt;
  },
  methods: {
    cleanWord(text) {
      text = text.replace(/[{()}]/g, '');

      if (text.endsWith(';')) {
        text = text.slice(0, -1);
      }

      return text;
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
  border-bottom: 1px var(--q-color-accent) dotted;
  text-decoration: none;

  @media (prefers-color-scheme: dark) {
    border-color: var(--q-color-white);
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
