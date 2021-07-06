<template>
  <div
    class="q-py-xs"
  >
    <div class="content">
      <q-breadcrumbs
        :class="$q.dark.isActive ? 'text-black' : 'text-white'"
        class="text-weight-medium"
      >
        <template #separator>
          <q-icon
            size="1em"
            :name="fasChevronRight"
          />
        </template>
        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-black' : 'text-white'"
          :icon="fasHome"
        >
          <a
            :href="`${config.breadcrumbNavigation.website}`"
            :class="$q.dark.isActive ? 'text-black' : 'text-white'"
            class="header-links"
          >
            {{ $t(`${config.breadcrumbNavigation.title_homePage_key}`) }}
          </a>
        </q-breadcrumbs-el>

        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-black' : 'text-white'"
          :icon="fasSearch"
        >
          <a
            :href="`${config.breadcrumbNavigation.search}`"
            :class="$q.dark.isActive ? 'text-black' : 'text-white'"
            class="header-links"
          >
            {{ $t('search') }}
          </a>
        </q-breadcrumbs-el>

        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-black' : 'text-white'"
          :label="$t(`${config.breadcrumbNavigation.title_viewer_key}`)"
          :icon="fasFileAlt"
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
