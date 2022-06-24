<template>
  <div
    class="q-py-xs"
  >
    <div class="content">
      <q-breadcrumbs
        :class="$q.dark.isActive ? 'text-dark' : 'text-white'"
        class="text-weight-medium"
      >
        <template #separator>
          <q-icon
            :name="fasChevronRight"
            size="1em"
          />
        </template>
        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-dark' : 'text-white'"
        >
          <a
            :class="$q.dark.isActive ? 'text-dark' : 'text-white'"
            :href="redirectUrl"
            class="header-links"
          >
            <q-icon
              :name="fasHome"
            />
            {{ $t(`${config.breadcrumbNavigation.title_homepage_key}`) }}
          </a>
        </q-breadcrumbs-el>

        <q-breadcrumbs-el
          v-if="!!isMultipleSearchterm || searchTerm"
          :class="$q.dark.isActive ? 'text-dark' : 'text-white'"
        >
          <a
            :class="$q.dark.isActive ? 'text-dark' : 'text-white'"
            :href="transformRedirectUrl"
            class="header-links"
          >
            <q-icon
              :name="fasSearch"
            />
            {{ isMultipleSearchterm ? this.$t(multiSearchTermKey) : searchTerm }}
          </a>
        </q-breadcrumbs-el>

        <q-breadcrumbs-el
          :icon="fasFileAlt"
          :label="$t(`${config.breadcrumbNavigation.title_viewer_key}`)"
        />
      </q-breadcrumbs>
    </div>
  </div>
</template>

<script>
import {
  fasHome,
  fasFileAlt,
  fasChevronRight,
  fasSearch,
} from '@quasar/extras/fontawesome-v5';

export default {
  name: 'BreadcrumbNavigation',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    redirectUrl() {
      return this.$route.query.redirectUrl || this.config.breadcrumbNavigation.website;
    },

    searchPagePath() {
      return this.config.breadcrumbNavigation.search_page_path || '';
    },

    searchQueryParam() {
      return this.config.breadcrumbNavigation.search_query_param || 'searchTerm';
    },

    searchTerm() {
      return this.$route.query[this.searchQueryParam];
    },

    isMultipleSearchterm() {
      return !!this.multiSearchTerm.length;
    },

    multiSearchTermKey() {
      return this.config.breadcrumbNavigation.multiSearch_key || '';
    },

    multiSearchTerm() {
      const multiSearchRegex = new RegExp(`${this.searchQueryParam}\\[.*\\]\\[.*\\]`, 'g');
      const { query } = this.$route;
      const availableValues = Object.keys(query).filter((el) => el.match(multiSearchRegex));

      return availableValues.map((key) => `${key}=${query[key]}`).join('&');
    },

    page() {
      return this.$route.query.page || 1;
    },

    transformRedirectUrl() {
      return `${this.redirectUrl}${this.searchPagePath}?page=${this.page}${this.isMultipleSearchterm ? `&${this.multiSearchTerm}` : `&${this.searchQueryParam}=${this.searchTerm}`}`;
    },
  },
  created() {
    this.fasHome = fasHome;
    this.fasFileAlt = fasFileAlt;
    this.fasChevronRight = fasChevronRight;
    this.fasSearch = fasSearch;
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 12px;
}

.header-links {
  margin-left: 8px;
  text-decoration: none;
}

.q-breadcrumbs__el-icon {
  font-size: 100% !important;
}

</style>
