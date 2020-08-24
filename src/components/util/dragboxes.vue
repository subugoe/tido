<template>
  <section>
    <p>Just drag and drop panels</p>
    <Draggable v-model="results" @change="$emit('updated', results)">
      <transition-group class="panel-container">
        <div v-for="(box, i) in results" :key="`box${i}`"
          class="panel-box unselect-text"
          v-text="box.toolbar"
          />
      </transition-group>
    </Draggable>
  </section>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
  components: {
    Draggable,
  },
  props: {
    boxs: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    results: [],
  }),
  mounted() {
    this.results = this.boxs;
  },
};
</script>

<style lang="sass" scoped>
  .panel-container
    display: flex
    flex-wrap: wrap
  .panel-box
    color: black
    background-color: white
    padding: 10px
    margin: 5px
    text-transform: capitalize
    cursor: pointer
    border-radius: 10px
</style>
