<template>
  <div class="col-xs-auto">
    <q-btn color="grey-5" flat :title="$t('change_language')" :icon="icon">
      <q-menu anchor="center middle" fit self="center middle">
        <q-list>
          <q-item
            v-for="lang in langs"
            :key="lang.value"
            v-close-popup
            clickable
            :class="{ language: selectedLang === lang.value }"
            @click="handleLanguageChange(lang)"
          >
            <q-item-section>{{ lang.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { biTranslate } from '@quasar/extras/bootstrap-icons';
import {
  computed, onBeforeMount, onMounted, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const store = useStore();
const i18n = useI18n();

const langs = [
  { label: 'DE', value: 'de-de' },
  { label: 'EN', value: 'en-US' },
];
const selectedLang = ref('en-US');
const icon = ref(null);

const config = computed(() => store.getters['config/config']);

watch(() => selectedLang.value, (value) => i18n.$locale = value);

onBeforeMount(() => icon.value = biTranslate);
onMounted(() => {
  selectedLang.value = config.value.lang || 'en-US';
});
function handleLanguageChange(lang) {
  selectedLang.value = lang.value;
}
</script>

<style lang="scss">
.language {
  background-color: $grey-5;
}
</style>
