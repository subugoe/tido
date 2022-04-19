export default function AnnotationState() {
  return {
    contentFontSize: 16,
    activeTab: '',
    activeAnnotations: {},
    annotations: [],
    filteredAnnotations: [],
    isLoading: false,
    isContentLoading: false,
  };
}
