<template>
  <q-toolbar
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'"
  >
    <div class="footer__wrap">
      <div
        bordered
        class="row justify-center items-center"
        reveal
      >
        <Language v-if="config['language-switch']" />

        <Color :projectcolors="projectcolors" />
        <Softwareinfo />
      </div>
    </div>
  </q-toolbar>
</template>

<script>
import Color from '@/components/color.vue';
import Language from '@/components/language.vue';
import Softwareinfo from '@/components/softwareinfo.vue';

export default {
  name: 'Footer',
  components: {
    Color,
    Language,
    Softwareinfo,
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    projectcolors: {
      type: Object,
      default: () => {},
    },

  },
};
</script>

<style lang="scss" scoped>
.footer__wrap {
  margin: 0 auto;
  max-width: 1200px;
}
</style>
