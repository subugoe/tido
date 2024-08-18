<template>
  <div class="annotations-view t-px-4 t-pt-4">
    <template v-if="filteredAnnotations.length">
      <VariantsList
        v-if="hasVariants()"
        class="custom-font"
        :annotations="filteredAnnotations"
        :types="types"
      />
      <AnnotationsList
        v-else
        class="custom-font"
        :annotations="filteredAnnotations"
        :types="types"
      />
    </template>
    <MessageBox
      v-else
      :message="$t(message)"
      :notification-colors="config.notificationColors"
      :title="$t('no_annotations_available')"
      type="info"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed, ref, watch,
} from 'vue';
import AnnotationsList from '@/components/annotations/AnnotationsList.vue';
import MessageBox from '@/components/MessageBox.vue';
import * as AnnotationUtils from '@/utils/annotations';

import { useConfigStore } from '@/stores/config';
import { useAnnotationsStore } from '@/stores/annotations';
import { useContentsStore } from '@/stores/contents';
import VariantsList from "@/components/annotations/variants/VariantsList.vue";

const configStore = useConfigStore();
const annotationStore = useAnnotationsStore();
const contentStore = useContentsStore();

const props = defineProps({
  url: String,
  types: Array,
});

const message = ref('no_annotations_in_view');

const config = computed(() => configStore.config);
const annotations = computed<Annotation[]>(() => annotationStore.annotations);
const filteredAnnotations = computed<Annotation[]>(() => annotationStore.filteredAnnotations);
const activeContentUrl = computed<string>(() => contentStore.activeContentUrl);
const updateTextHighlighting = computed(() =>
  // We need to make sure that annotations are loaded (this.annotations),
  // the text HTML is present in DOM (this.activeContentUrl is set after DOM update)
  // and the annotation are filtered by type (this.filteredAnnotations).
  `${annotations.value !== null}|${activeContentUrl.value}`);

watch(
  updateTextHighlighting,
  (contentData) => {
    const [hasAnnotations, activeContentUrl] = contentData.split('|');
    if (hasAnnotations !== 'true' || activeContentUrl === 'null') return;
    annotationStore.resetAnnotations();
    annotationStore.selectFilteredAnnotations(props.types);
    highlightTargetsLevel0();
  },
  { immediate: true },
);

function highlightTargetsLevel0() {
  const mergedSelector = filteredAnnotations.value
    .reduce((acc, cur) => {
      const selector = AnnotationUtils.generateTargetSelector(cur);
      if (acc !== '') {
        acc += ',';
      }
      acc += selector;
      return acc;
    }, '');

  if (mergedSelector) {
    AnnotationUtils.highlightTargets(mergedSelector, { level: 0 });
  }
}

function hasVariants() {
  return props.types.findIndex(type => type.name === 'Variant') > -1;
}

</script>
