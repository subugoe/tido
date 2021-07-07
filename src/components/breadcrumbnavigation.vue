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
          :icon="fasHome"
        >
          <a
            :class="$q.dark.isActive ? 'text-dark' : 'text-white'"
            :href="`${config.breadcrumbNavigation.website}`"
            class="header-links"
          >
            {{ $t(`${config.breadcrumbNavigation.title_homepage_key}`) }}
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
