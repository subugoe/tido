<template>
  <div
    class="projectheader q-py-xs"
    :class="$q.dark.isActive ? 'bg-white text-black' : 'bg-accent'"
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
            :href="`${projectheader.website}`"
            :class="$q.dark.isActive ? 'text-black' : 'text-white'"
            class="header-links"
          >
            {{ $t(`${projectheader.title_homePage_key}`) }}
          </a>
        </q-breadcrumbs-el>

        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-black' : 'text-white'"
          :icon="fasSearch"
        >
          <a
            :href="`${projectheader.search}`"
            :class="$q.dark.isActive ? 'text-black' : 'text-white'"
            class="header-links"
          >
            {{ $t('search') }}
          </a>
        </q-breadcrumbs-el>

        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-black' : 'text-white'"
          :label="$t(`${projectheader.title_viewer_key}`)"
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
  name: 'ProjectHeader',
  props: {
    projectheader: {
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

.projectheader {
  @media (prefers-color-scheme: dark) {
    background-color: var(--q-color-white);
    color: var(--q-color-dark);
  }
}

.q-breadcrumbs__el-icon {
  font-size: 100% !important;
}

</style>
