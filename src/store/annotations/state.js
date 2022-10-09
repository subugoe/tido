export default function AnnotationState() {
  return {
    activeTab: '',
    activeAnnotations: {},
    annotations: null,
    filteredAnnotations: [],
    isLoading: false,
    isContentLoading: false,
  };
}
