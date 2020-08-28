<template>
  <section>
    <p>Drag and drop the buttons to reorder the panels</p>

    <Draggable v-model="results" @change="$emit('updated', results)">
      <transition-group class="panel-container">
        <div v-for="(box, i) in results" :key="`box${i}`"
          class="panel-box unselect-text"
          v-html="box.toolbar"
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
    background-color: white
    border-radius: 10px
    color: black
    cursor: pointer
    margin: 5px
    padding: 10px
    text-transform: uppercase
</style>
