<template>
  <q-icon
    v-if="name"
    :color="isDarkMode ? 'grey-1 text-grey-1' : 'primary'"
    :name="iconName"
    size="16px"
  />
</template>
<script>
import { Dark } from 'quasar';
import { isUrl } from 'src/utils';
import {
  biPersonFill, biGeoAltFill, biChatFill, biBoxArrowUpRight, biPenFill, biPencilSquare,
} from '@quasar/extras/bootstrap-icons';

export default {
  name: 'AnnotationIcon',
  props: {
    name: String,
  },
  computed: {
    show() {
      return !!(this.types.find((type) => type.name === this.contentType)?.icon);
    },
    isDarkMode() {
      return Dark.isActive;
    },
    iconName() {
      return isUrl(this.name) ? `img:${this.name}` : this.getIcon(this.name);
    },
  },
  created() {
    this.icons = {
      biPersonFill,
      biGeoAltFill,
      biChatFill,
      biBoxArrowUpRight,
      biPenFill,
      biPencilSquare,
    };
  },
  methods: {
    getIcon(name) {
      return this.icons[name];
    },
  },
};
</script>

<style scoped>

</style>
