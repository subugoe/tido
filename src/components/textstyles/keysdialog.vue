<template>
  <div @keydown.esc="modalOpen = false">
    <q-btn
      v-if="textModal.length"
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
      @click="modalOpen = true"
    >
      <q-icon
        :name="fasCompass"
        class="q-pr-md"
        size="xs"
      />
      <div class="text-h6 text-uppercase">
        Keys
      </div>
    </q-btn>

    <div
      :class="{ 'modal-open': modalOpen }"
      class="keyModal"
      transition-hide="scale"
      transition-show="scale"
    >
      <q-card :class="$q.dark.isActive ? 'bg-black' : 'bg-white text-black'">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-uppercase">
            KEYS
          </div>
        </q-card-section>

        <q-card-section class="row items-center q-pb-none">
          <div class="text-h8">
            Lorem ipsum dolor sit amut. Lorem ipsum dolor sit amut.
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
            unelevated
            :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
            @click="toggleModal"
          >
            <q-icon
              :name="fasWindowClose"
              class="q-pr-sm"
              size="xs"
            />
            <div class="text-h8 text-uppercase">
              CLOSE
            </div>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { fasWindowClose, fasCompass } from '@quasar/extras/fontawesome-v5';
import textLabels from './highlights';

export default {
  props: {
    map: {
      required: true,
      type: Object,
    },
  },

  data: () => ({
    modalOpen: false,
    textLabels,
  }),

  computed: {
    textModal() {
      return this.textLabels.filter((t) => this.map[t.classes]);
    },
  },

  created() {
    this.fasCompass = fasCompass;
    this.fasWindowClose = fasWindowClose;
  },

  methods: {
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.keyModal {
  align-items: center;
  bottom: 0;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform: scale(0);
}

.modal-open {
  display: flex;
  transform: scale(1);
}

.text-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
