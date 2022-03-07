<template>
  <q-icon
    v-if="showIcon"
    :color="isDarkMode ? 'grey-1 text-grey-1' : 'accent'"
    :name="name"
    size="16px"
  />
</template>
<script>
import * as Icons from '@quasar/extras/fontawesome-v5';
import { Dark } from 'quasar';

export default {
  name: 'AnnotationIcon',
  props: {
    showIcon: {
      type: Boolean,
      default: () => false,
    },
    contentType: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      types: [
        {
          contenttype: 'Person',
          icon: 'fasUser',
          label: 'Names',
        },
        {
          contenttype: 'Place',
          icon: 'fasMapMarkerAlt',
          label: 'Places',
        },
        {
          contenttype: 'Editorial Comment',
          icon: 'fasComment',
          label: 'Comments',
        },
        {
          contenttype: 'Org',
          icon: 'fasLandmark',
          label: 'Organization',
        },
        {
          contenttype: 'Object',
          icon: 'fasThLarge',
          label: 'Object',
        },
        {
          contenttype: 'Date',
          icon: 'fasCalendar',
          label: 'Date',
        },
        {
          contenttype: 'Abstract',
          annotationType: 'text',
          displayWhen: 'Edierter Text',
          label: 'Erläuterung',
        },
        {
          contenttype: 'Work',
          icon: 'fasThLarge',
          label: 'Werk',
        },
        {
          contenttype: 'Work',
          icon: 'fasExternalLinkSquareAlt',
          label: 'Werk',
        },
      ],
    };
  },
  computed: {
    isDarkMode() {
      return Dark.isActive;
    },
    name() {
      return Icons[this.types.filter(
        (annotation) => annotation.contenttype === this.contentType,
      )[0].icon];
    },
  },
};
</script>

<style scoped>

</style>
