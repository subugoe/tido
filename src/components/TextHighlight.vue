<template>
  <span
    :id="targetId"
    :style="{color: color}"
    @click="onClick"
  >
    <AnnotationIcon
      :content-type="'Person'"
      :show-icon="showIcon"
    />
    {{ text }}
  </span>
</template>
<script>
import AnnotationIcon from 'components/annotations/AnnotationIcon';

export default {
  name: 'TextHighlight',
  components: { AnnotationIcon },
  props: {
    targetId: {
      type: String,
      default: () => '',
    },
    text: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      color: 'inherit',
      showIcon: false,
    };
  },
  mounted() {
    // const unsubscribe = this.$options.store.subscribeAction((action, state) => {
    //   console.log(action.type);
    //   console.log(action.payload);
    //
    //   if (action.type === 'hideAnnotationIcon' && action.payload === this.targetId) {
    //     this.showIcon = false;
    //   }
    // });
  },
  methods: {
    onClick() {
      this.$options.store.dispatch('annotations/addActiveAnnotation', this.targetId);
    },
  },
};
</script>

<style scoped>

</style>
