<template>
  <div
    class="projectheader q-py-xs"
    :class="$q.dark.isActive ? 'bg-white text-black' : 'bg-accent'"
  >
    <div class="content">
      <q-breadcrumbs :class="$q.dark.isActive ? 'text-black' : 'text-white'">
        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-black' : 'text-white'"
          :label="projectheader.title_back"
          to="/"
          :icon="fasHome"
        />
        <q-breadcrumbs-el
          :class="$q.dark.isActive ? 'text-black' : 'text-white'"
          :label="projectheader.title_view"
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
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 12px;
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
