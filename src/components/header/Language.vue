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
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { biTranslate } from '@quasar/extras/bootstrap-icons';

const store = useStore();
const { locale: i18nLocale } = useI18n();

const langs = ref([
  { label: 'DE', value: 'de-de' },
  { label: 'EN', value: 'en-US' },
]);
const selectedLang = ref('en-US');

const icon = biTranslate;

const config = computed(() => store.getters['config/config']);

watch(
  selectedLang,
  (lang) => {
    i18nLocale.value = lang;
  },
);

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
