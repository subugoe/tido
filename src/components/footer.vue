<template>
  <q-footer
    bordered
    reveal
    class="row justify-start items-center"
    >
    <Language v-if="standalone" />
    <Softwareinfo />
  </q-footer>
</template>

<script>
import Language from '@/components/language.vue';
import Softwareinfo from '@/components/softwareinfo.vue';

export default {
  name: 'Footer',
  components: {
    Language,
    Softwareinfo,
  },
  props: {
    standalone: Boolean,
  },
};
</script>

<style lang="scss" scoped>
footer {
  background-color: $color-footer__background;
  color: $color-footer__font-color;
  @media (prefers-color-scheme: dark) {
    background-color: $color-footer__background--dark;
    color: $color-footer__font-color--dark;
  }
}
</style>
