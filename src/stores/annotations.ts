import { defineStore } from 'pinia'
import {
    computed, ref,
  } from 'vue';

import * as AnnotationUtils from '@/utils/annotations';
import { request } from '@/utils/http';
import * as Utils from '@/utils';
import { scrollIntoViewIfNeeded } from '@/utils';
import { useConfigStore} from '@/stores/config';


export const useAnnotationsStore = defineStore('annotations', () => {

    const activeTab = ref<string>('')
    const activeAnnotations = ref({}) 
    const activeAnnotSelectVariantItems = ref({})
    const variantItemsColors = ref({})
    const annotations = ref<Annotation[]>(null)
    const filteredAnnotations = ref<Annotation[]>([])
    const isLoading = ref<boolean>(false);


    const isAllAnnotationSelected = computed<boolean>((total) => Object.keys(activeAnnotations.value).length === total)
    const isNoAnnotationSelected = computed<boolean>(() => !Object.keys(activeAnnotations.value).length)

    
    const setActiveAnnotations = (annotations: ActiveAnnotation) => {
        activeAnnotations.value = annotations  
    }

    function setAnnotations(payload: Annotation[]) {
        annotations.value = payload
    }
    
    function updateAnnotationLoading(payload: boolean) {
        isLoading.value = payload;
    }

    function setFilteredAnnotations(payload: Annotation[]) {
        filteredAnnotations.value = payload
    }

    function setVariantItemsColors(payload) {
      variantItemsColors.value = payload
    }

    function setActiveAnnotSelectVariantItems(payload) {
      activeAnnotSelectVariantItems.value = payload
    }

    function updateActiveAnnotSelectVariantItems(id, payload) {
      activeAnnotSelectVariantItems.value[id] = payload
    }

    const addActiveAnnotation = (id: string) => {
        const annotationStore = useAnnotationsStore()
        const configStore = useConfigStore()
        const newActiveAnnotation: Annotation = annotations.value.find((annotation) => annotation.id === id);
        if (!newActiveAnnotation || activeAnnotations.value[id]) {
          return;
        }
      
        const iconName: string = configStore.getIconByType(newActiveAnnotation.body['x-content-type']);

        const activeAnnotationsList: ActiveAnnotation = { ...activeAnnotations.value };
      
        activeAnnotationsList[id] = newActiveAnnotation;
        
        annotationStore.setActiveAnnotations(activeAnnotationsList)
      
        const selector: string = Utils.generateTargetSelector(newActiveAnnotation);
        const elements: Array<HTMLElement> = (selector) ? [...document.querySelectorAll(selector)] : [];
        Utils.highlightTargets(selector, { operation: 'INC' });
      
        if (elements.length > 0) {
          const target: HTMLElement = elements[0];
          Utils.addIcon(target, newActiveAnnotation, iconName);
          scrollIntoViewIfNeeded(target, target.closest('.panel-body'));
        }
    };


    const selectFilteredAnnotations = (types: AnnotationType[]): boolean | void => {
        const configStore = useConfigStore()
        const activeContentType: string =  configStore.activeContentType  
        let filteredAnnotations: Annotation[] = [];
      
        if (annotations !== null) {
          filteredAnnotations = types.length === 0 ? annotations.value : annotations.value.filter(
            (annotation) => {
              const type: AnnotationType = types.find(({ name }) => name === annotation.body['x-content-type']);
              // First we check if annotation fits to the current view
              if (!type) return false;
      
              // Next we check if annotation should always be displayed on the current content tab
              if (type?.displayWhen && type?.displayWhen === activeContentType) return true;
      
              // If the display is not dependent on displayWhen then we check if annotation's target exists in the content
              const selector: string = AnnotationUtils.generateTargetSelector(annotation);
              if (selector) {
                const el: HTMLElement = document.querySelector(selector);
                if (el) {
                  return true;
                }
              }
      
              return false;
            },
          );
        }
        setFilteredAnnotations(filteredAnnotations)
    };


    const addHighlightAttributesToText = (dom) => {  
      if (annotations.value !== null) {
        annotations.value.forEach((annotation) => {
          const { id } = annotation;
          const selector = Utils.generateTargetSelector(annotation);
          if (selector) {
            Utils.addHighlightToElements(selector, dom, id);
          }
        });
      } 
    };

    const annotationLoaded = (annotations) => {
        setAnnotations(annotations)
        updateAnnotationLoading(false)
    };

    
    const removeActiveAnnotation = (id) => {
        const annotationStore = useAnnotationsStore()
        const removeAnnotation = activeAnnotations.value[id];

        if (!removeAnnotation) {
          return;
        }

        // If removed active annotation is variant - then set all the variant items selection to false for this annotation

      
        const activeAnnotationsList = { ...activeAnnotations.value };
      
        delete activeAnnotationsList[id];
        annotationStore.setActiveAnnotations(activeAnnotationsList)
      
        const selector = AnnotationUtils.generateTargetSelector(removeAnnotation);
        if (selector) {
          AnnotationUtils.highlightTargets(selector, { operation: 'DEC' });
          AnnotationUtils.removeIcon(removeAnnotation);
        }
      };

    
    
    const resetAnnotations = () => {      

        if (annotations.value !== null) {
          annotations.value.forEach((annotation) => {
            const selector = AnnotationUtils.generateTargetSelector(annotation);
            if (selector) {
              AnnotationUtils.highlightTargets(selector, { level: -1 });
              AnnotationUtils.removeIcon(annotation);
            }
          });
        }
        setActiveAnnotations({})
    };



    const initAnnotations = async (url) => {
        try {
          const annotations = await request(url);
      
          if (!annotations.first) {
            annotationLoaded([])
            return;
          }
      
          const current = await request(annotations.first);
      
          if (Array.isArray(current.items)) {
            annotationLoaded(current.items)
          }
        } catch (err) {
          annotationLoaded([])
        }
    };



    const addHighlightHoverListeners = () => {
        const annotationElements = Array.from(document.querySelectorAll('[data-annotation]'));
      
        const tooltipEl = null;
        const configStore = useConfigStore()
      
        // Annotations can be nested, so we filter out all outer elements from this selection and
        // iterate over the deepest elements
        annotationElements.forEach((el) => {
          el.addEventListener(
            'mouseenter',
            ({ clientX: x, clientY: y }) => {
              let elementFromPoint = document.elementFromPoint(x, y);
      
              if (!elementFromPoint.hasAttribute('data-annotation')) {
                elementFromPoint = null;
              }
      
              const currentElement = elementFromPoint ?? el;
      
              const annotationTooltipModels = filteredAnnotations.value.reduce((acc, curr) => {
                const { id } = curr;
                const name = configStore.getIconByType(curr.body['x-content-type'])  
                acc[id] = {
                  value: curr.body.value,
                  name,
                };
                return acc;
              }, {});
      
              const currentAnnotations = Utils.getValuesFromAttribute(currentElement, 'data-annotation-ids');
              const closestAnnotationId = currentAnnotations[currentAnnotations.length - 1];
              const closestAnnotationTooltipModel = annotationTooltipModels[closestAnnotationId];
              let annotationIds = discoverParentAnnotationIds(currentElement);
              annotationIds = discoverChildAnnotationIds(currentElement, annotationIds);
      
              const otherAnnotationTooltipModels = Object.keys(annotationIds)
                .map((id) => annotationTooltipModels[id])
                .filter((m) => m);
      
              AnnotationUtils.createOrUpdateTooltip.bind(
                this,
                currentElement,
                { closest: closestAnnotationTooltipModel, other: otherAnnotationTooltipModels },
                document.getElementById('text-content'),
              )();
            },
            false,
          );
          el.addEventListener('mouseout', () => tooltipEl.remove(), false);
        });
    };



    const addHighlightClickListeners = () => {
        const textEl = document.querySelector('#text-content>div>*');
      
        if (!textEl) return;
      
        textEl.addEventListener('click', ({ target }) => {
          // The click event handler works like this:
          // When clicking on the text we pick the whole part of the text which belongs to the highest parent annotation.
          // Since the annotations can be nested we avoid handling each of them separately
          // and select/deselect the whole cluster at once.
          // The actual click target decides whether it should be a selection or a deselection.
      
          // First we make sure to have a valid target.
          // Although we receive a target from the event it can be a regular HTML element within the annotation.
          // So we try to find it's nearest parent element that is marked as annotation element.
          if (!target.dataset.annotation) {
            target = getNearestParentAnnotation(target);
          }
    
          if (!target) {
            return;
          }
      
          // Next we look up which annotations need to be selected
          let annotationIds = {};
      
          Utils.getValuesFromAttribute(target, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
          annotationIds = discoverParentAnnotationIds(target, annotationIds);
          annotationIds = discoverChildAnnotationIds(target, annotationIds);
            
          // We check the highlighting level to determine whether to select or deselect.
          // TODO: it might be better to check the activeAnnotations instead
          const targetIsSelected = parseInt(target.getAttribute('data-annotation-level'), 10) > 0;
      
          Object.keys(annotationIds).forEach((id) => {
            // We need to check here if the right annotations panel tab is active
            // a.k.a. it exists in the current filteredAnnotations
            const annotation = filteredAnnotations.value.find((filtered) => filtered.id === id);
            const selector = annotation.target[0].selector.value
            if (annotation) {
              if (targetIsSelected) {
                removeActiveAnnotation(id)
                if (AnnotationUtils.isVariant(annotation)) {
                  // we need to know which witnesses belong to this annotation - so that we can remove the witnesses chips from the text
                  const witnessesHtml = AnnotationUtils.getWitnessesHtmlEl(selector)
                  const witnessesList = AnnotationUtils.getWitnessesList(witnessesHtml)
                  // remove the 'witnesses chips' which are selected
                  AnnotationUtils.removeWitnessesChipsWhenDeselectText(witnessesList, selector)
                  delete activeAnnotSelectVariantItems.value[annotation.id]
                }
              } else {
                addActiveAnnotation(id)
                if(AnnotationUtils.isVariant(annotation)) {
                  // if annotation is variant - additionally set the variant items selection to true
                  const variantItemsSelect = AnnotationUtils.initVariantItemsSelection(annotation, true)

                  activeAnnotSelectVariantItems.value[annotation.id] = [activeAnnotations.value[annotation.id], variantItemsSelect]
                  // add all the 'witnesses chips' for this annotation variant
                  AnnotationUtils.addWitnessesChipsWhenSelectText(variantItemsSelect, selector, variantItemsColors.value)
                }
              }
            }
          });
    });
    };


    function getNearestParentAnnotation(element) {
        const parent = element.parentElement;
    
        if (!parent) return null;
    
        if (parent.dataset?.annotation) {
          return parent;
        }
        return getNearestParentAnnotation(parent);
    }

    const selectAll = () => {
      filteredAnnotations.value.forEach(({ id }) => !activeAnnotations.value[id] && addActiveAnnotation(id));
    };

    const selectNone = () => {
      filteredAnnotations.value.forEach(({ id }) => activeAnnotations.value[id] && removeActiveAnnotation(id)); 
    };

    function discoverParentAnnotationIds(el, annotationIds = {}) {
      const parent = el.parentElement;
      if (parent && parent.id !== 'text-content') {
        Utils.getValuesFromAttribute(parent, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
        return discoverParentAnnotationIds(parent, annotationIds);
      }
      return annotationIds;
    }

    function discoverChildAnnotationIds(el, annotationIds = {}) {
      const { children } = el;
    
      [...children].forEach((child) => {
        if (child.dataset.annotation) {
          Utils.getValuesFromAttribute(child, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
          annotationIds = discoverChildAnnotationIds(child, annotationIds);
        }
      });
      return annotationIds;
    }

    return {
        activeTab, activeAnnotations, activeAnnotSelectVariantItems, annotations, filteredAnnotations, isLoading, variantItemsColors,  // states
        isAllAnnotationSelected, isNoAnnotationSelected,                              // computed
        setActiveAnnotations, setAnnotations, updateAnnotationLoading, setFilteredAnnotations, setActiveAnnotSelectVariantItems, setVariantItemsColors,  // functions
        addActiveAnnotation, selectFilteredAnnotations, addHighlightAttributesToText, updateActiveAnnotSelectVariantItems,
        annotationLoaded, removeActiveAnnotation, resetAnnotations, initAnnotations,
        addHighlightHoverListeners, addHighlightClickListeners, getNearestParentAnnotation,
        selectAll, selectNone, discoverParentAnnotationIds, discoverChildAnnotationIds
     }

})