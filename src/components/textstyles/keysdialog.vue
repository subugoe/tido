<template>
  <q-toolbar>
    <q-btn
      v-if="textModal.length"
      class="text_key"
      label="Keys"
      outline
      size="md"
      @click="status = true"
    />

    <q-dialog
      v-model="status"
      transition-hide="scale"
      transition-show="scale"
    >
      <q-card :class="$q.dark.isActive ? 'bg-black' : 'bg-white text-black'">
        <q-card-section>
          <div class="text-h6 text-uppercase">
            Text Style Keys
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-list">
            <div
              v-for="(text, i) in textModal"
              :key="`b${i}`"
              class="text-item"
            >
              <div
                :class="['text-overline', text.classes]"
                style="font-size: 16px;"
                v-text="text.label"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="OK"
            flat
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-toolbar>
</template>

<script>
import textLabels from './highlights';

export default {
  props: {
    map: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    status: false,
    textLabels,
  }),
  computed: {
    textModal() {
      return this.textLabels.filter((t) => this.map[t.classes]);
    },
  },
};
</script>

<style lang="scss" scoped>
.text-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
