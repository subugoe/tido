import {defineStore} from 'pinia'
import { ref, reactive } from 'vue';

import * as AnnotationUtils from '@/utils/annotations';
import {request} from '@/utils/http';
import * as Utils from '@/utils';
import {scrollIntoViewIfNeeded} from '@/utils';
import {useConfigStore} from '@/stores/config';
import TextEventBus from '@/utils/TextEventBus';

import { getItemColorBasedOnIndex } from '@/utils/color';



export const useAnnotationsStore = defineStore('annotations', () => {

  const activeTab = ref<string>('')
  const activeAnnotations = ref({})
  const variantItemsColors = ref({})
  const annotations = ref<Annotation[]>(null)
  const witnesses = ref<Witness[]>([])
  const filteredAnnotations = ref<Annotation[]>([])
  const visibleAnnotations = ref<Annotation[]>([])
  const isLoading = ref<boolean>(false);
  const isSingleSelectMode = ref<boolean>(false)
  let activeWitnessesIds = reactive({})



  const setActiveAnnotations = (annotations: ActiveAnnotation) => {
    activeAnnotations.value = annotations
  }

  function setVisibleAnnotations(payload: Annotation[]) {
    visibleAnnotations.value = payload
  }

  function setActiveWitnessesIds(payload) {
    activeWitnessesIds = payload
  }

  function updateAnnotationLoading(payload: boolean) {
    isLoading.value = payload;
  }

  function setVariantItemsColors(payload) {
    variantItemsColors.value = payload
  }

  function getVariantsOfSelectedWitnesses(): Annotation[] {
    const list = []
    if (filteredAnnotations.value.length === 0) return []
    if (Object.keys(activeWitnessesIds).length === 0) return []

    filteredAnnotations.value.forEach((annotation) => {
      const witnesses = annotation.body.value.witnesses
      const isActive = witnesses.find(witness => activeWitnessesIds[witness] === true)
      if (isActive) {
        list.push(annotation)
      }
    })
    return list
  }

  const addActiveAnnotation = (id: string) => {
    const annotationStore = useAnnotationsStore()
    const newActiveAnnotation: Annotation = annotations.value.find((annotation) => annotation.id === id);
    if (!newActiveAnnotation || activeAnnotations.value[id]) {
      return;
    }

    const activeAnnotationsList: ActiveAnnotation = {...activeAnnotations.value};

    activeAnnotationsList[id] = newActiveAnnotation;

    annotationStore.setActiveAnnotations(activeAnnotationsList)

    const selector: string = Utils.generateTargetSelector(newActiveAnnotation);
    const elements: Array<HTMLElement> = (selector) ? [...document.querySelectorAll(selector)] : [];

    if (elements.length > 0) {
      // If the annotation target exists in the text panel
      const target: HTMLElement = elements[0];

      if (AnnotationUtils.isVariant(newActiveAnnotation)) {
        if (AnnotationUtils.getCurrentLevel(target) <= 0) {
          // Since variants can have multiple targets, we raise the level only once
          Utils.highlightTargets(selector, {operation: 'INC'});
        }
        addVariantAnnotation(target, newActiveAnnotation);
      } else {
        Utils.highlightTargets(selector, {operation: 'INC'});
        addSimpleAnnotation(target, newActiveAnnotation);
      }

      scrollIntoViewIfNeeded(target, target.closest('.panel-body'));
    }
  };

  const addSimpleAnnotation = (targetElement: HTMLElement, annotation: Annotation) => {
    const configStore = useConfigStore()
    const iconName: string = configStore.getIconByType(annotation.body['x-content-type']);
    Utils.addIcon(targetElement, annotation, iconName);
  }

  const addVariantAnnotation = (targetElement: HTMLElement, annotation: Annotation) => {
    annotation.body.value.witnesses.forEach(witness => {
      Utils.addWitness(targetElement, witness, variantItemsColors.value[witness])
    })
  }

  const selectFilteredAnnotations = (types: AnnotationType[]): void => {
    const configStore = useConfigStore()
    const activeContentType: string = configStore.activeContentType
    if (annotations.value !== null) {
      filteredAnnotations.value = types.length === 0 ? annotations.value : annotations.value.filter(
        (annotation) => {
          const type: AnnotationType = types.find(({name}) => name === annotation.body['x-content-type']);
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
    setVisibleAnnotations(filteredAnnotations.value)
  };

  const filterAnnotationsByWitnesses = (witnesses: string[]) => {

    // Deactivate annotations that are not included in the witnesses list
    Object
      .keys(activeAnnotations.value)
      .filter(key => !witnesses.find(witness => activeAnnotations.value[key].body.value.witnesses.includes(witness)))
      .forEach(key => removeActiveAnnotation(key));

    const activeIds = Object.keys(activeAnnotations.value)

    // Remove highlighting on all other annotations completely (reset all)
    visibleAnnotations.value
      .filter(annotation => !activeIds.includes(annotation.id))
      .forEach(annotation => {
        const selector = AnnotationUtils.generateTargetSelector(annotation);
        if (!selector) return;
        const selectorIsActive = activeIds.filter(id => selector === AnnotationUtils.generateTargetSelector(activeAnnotations.value[id])).length > 0;
        if (!selectorIsActive) {
          AnnotationUtils.highlightTargets(selector, {level: -1});
        }
      })

    // Set filtered annotations
    visibleAnnotations.value = annotations.value.filter((annotation) => {
      return AnnotationUtils.isVariant(annotation) && witnesses.find(witness => annotation.body.value.witnesses.includes(witness))
    })

    // When filtering by witness it can happen that a target is used for some other active annotation item,
    // In that case, we want to keep the level of highlighting it had and

    visibleAnnotations.value
      .filter(annotation => !activeIds.includes(annotation.id))
      .forEach(annotation => {
        const selector = AnnotationUtils.generateTargetSelector(annotation);
        if (!selector) return;
        const selectorIsActive = activeIds.filter(id => selector === AnnotationUtils.generateTargetSelector(activeAnnotations.value[id])).length > 0;
        const target = document.querySelector(selector)
        if(!target) return;

        if (!selectorIsActive && AnnotationUtils.getCurrentLevel(target) < 0) {
          AnnotationUtils.highlightTargets(selector, {level: 0});
        }
      })
  }

  const addHighlightAttributesToText = (dom) => {
    if (annotations.value !== null) {
      annotations.value.forEach((annotation) => {
        const {id} = annotation;
        const selector = Utils.generateTargetSelector(annotation);
        if (selector) {
          Utils.addHighlightToElements(selector, dom, id);
        }
      });
    }
  };

  const annotationLoaded = ({ items, refs }) => {
    annotations.value = items
    witnesses.value = refs

    preprocessVariants()
    allocateWitnessColorInVariantItem()

    updateAnnotationLoading(false)
  };

  function preprocessVariants () {
    if (annotations.value.length === 0) return

    let existsAnnotationWithWitnessNull = false

    for (let i = 0; i < annotations.value.length; i++) {
      const annotation = annotations.value[i]
      if (!AnnotationUtils.isVariant(annotation)) continue

      if (!Array.isArray(annotation.body.value.witnesses) || annotation.body.value.witnesses.length === 0) {
        annotation.body.value.witnesses = ['missing']
        existsAnnotationWithWitnessNull = true
      }
    }
    if (existsAnnotationWithWitnessNull) {
      witnesses.value.push({'idno': 'missing', 'manifest': ''})
    }
  }

 function allocateWitnessColorInVariantItem() {
    const colors = {}
    if (!witnesses.value) return
    if (witnesses.value.length === 0) return;

    witnesses.value.forEach((witness, i) => {
      colors[witness.idno] = getItemColorBasedOnIndex(i)
    })
    setVariantItemsColors(colors)
}

  const removeActiveAnnotation = (id) => {
    const annotationStore = useAnnotationsStore()
    const removeAnnotation = activeAnnotations.value[id];

    if (!removeAnnotation) {
      return;
    }

    // If removed active annotation is variant - then set all the variant items selection to false for this annotation
    const activeAnnotationsList = {...activeAnnotations.value};

    delete activeAnnotationsList[id];
    annotationStore.setActiveAnnotations(activeAnnotationsList)

    const selector = AnnotationUtils.generateTargetSelector(removeAnnotation);
    const textEl = document.querySelector('#text-content')
    const target = textEl.querySelector(selector)

    if (!target) return

    if (AnnotationUtils.isVariant(removeAnnotation)) {
      if (AnnotationUtils.getCurrentLevel(document.querySelector(selector)) > 0
        && Object.keys(activeAnnotations.value).findIndex(key => {
          const sel = AnnotationUtils.generateTargetSelector(activeAnnotations.value[key])
          return sel === selector
        }) === -1) {
        AnnotationUtils.highlightTargets(selector, {operation: 'DEC'});
      }
      removeVariantAnnotation(selector, removeAnnotation);
    } else {
      AnnotationUtils.highlightTargets(selector, {operation: 'DEC'});
      removeSimpleAnnotation(removeAnnotation);
    }
  };

  const removeSimpleAnnotation = (annotation: Annotation) => {
    AnnotationUtils.removeIcon(annotation);
  }

  const removeVariantAnnotation = (selector: string, annotation: Annotation) => {
    annotation.body.value.witnesses.forEach(witness => {
      AnnotationUtils.removeWitness(selector, witness);
    })
  }

  const resetAnnotations = () => {
    if (annotations.value !== null) {
      annotations.value.forEach((annotation) => {
        const selector = AnnotationUtils.generateTargetSelector(annotation);
        if (selector) {
          AnnotationUtils.highlightTargets(selector, {level: -1});
          AnnotationUtils.removeIcon(annotation);
          if (AnnotationUtils.isVariant(annotation)) {
            annotation.body.value.witnesses.forEach(witness => {
              AnnotationUtils.removeWitness(selector, witness);
            })
          }
        }
      });
    }
    setActiveAnnotations({})
  };

  const initAnnotations = async (url) => {
    try {
      const annotations = await request(url);

      if (!annotations.first) {
        annotationLoaded({ items: [], refs: [] })
        return;
      }

      const current = await request(annotations.first);

      if (Array.isArray(current.items)) {
        annotationLoaded(current)
      }
    } catch (err) {
      annotationLoaded({ items: [], refs: [] })
    }
  };

  const addHighlightClickListeners = () => {
    const textEl = document.querySelector('#text-content>div>*');

    if (!textEl) return;

    textEl.addEventListener('click', ({target}) => {
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
      TextEventBus.emit('click', { target })
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
    filteredAnnotations.value.forEach(({id}) => !activeAnnotations.value[id] && addActiveAnnotation(id));
  };

  const selectNone = () => {
    filteredAnnotations.value.forEach(({id}) => activeAnnotations.value[id] && removeActiveAnnotation(id));
  };

  const addVisibleAnnotations = (annotationIds: string[]) => {
    annotationIds.forEach((id) => {
      const annotation = annotations.value.find((a) => a.id === id);
      if (annotation) visibleAnnotations.value.push(annotation)
    })
  }

  const removeVisibleAnnotations = (annotationIds: string[]) => {
    annotationIds.forEach((id) => {
      const annotation = annotations.value.find((a) => a.id === id);
      if (annotation) {
        const index = visibleAnnotations.value
          .findIndex(filteredAnnotation => filteredAnnotation.id === annotation.id)

        if (index > -1) {
          visibleAnnotations.value.splice(index, 1)
        }
      }
    })
  }


  const activateAnnotationsByIds = (annotationIds: string[]) => {
    annotationIds.forEach((id) => {
      // We need to check here if the right annotations panel tab is active
      // a.k.a. it exists in the current filteredAnnotations
      const annotation = annotations.value.find((a) => a.id === id);
      if (annotation) {
        addActiveAnnotation(annotation.id)
      }
    })
  }



  const deactivateAnnotationsByIds = (annotationIds: string[]) => {
    annotationIds.forEach((id) => {
      // We need to check here if the right annotations panel tab is active
      // a.k.a. it exists in the current filteredAnnotations
      const annotation = annotations.value.find((a) => a.id === id);
      if (annotation) {
        removeActiveAnnotation(annotation.id)
      }
    })
  }


  const highlightTargetsLevel0 = () => {
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

  const enableSingleSelectMode = () => {
    resetAnnotations()
    highlightTargetsLevel0()
    visibleAnnotations.value = []
    isSingleSelectMode.value = true
  }

  const disableSingleSelectMode = () => {
    resetAnnotations()
    visibleAnnotations.value = getVariantsOfSelectedWitnesses()
    highlightTargetsLevel0();
    isSingleSelectMode.value = false
  }

  return {
    activeTab,
    activeAnnotations,
    annotations,
    witnesses,
    filteredAnnotations,
    visibleAnnotations,
    isLoading,
    isSingleSelectMode,
    variantItemsColors,
    activeWitnessesIds, // states
    setActiveAnnotations,
    setVisibleAnnotations,
    setVariantItemsColors,
    setActiveWitnessesIds,  // functions
    addActiveAnnotation,
    selectFilteredAnnotations,
    addHighlightAttributesToText,
    annotationLoaded,
    preprocessVariants,
    allocateWitnessColorInVariantItem,
    removeActiveAnnotation,
    resetAnnotations,
    initAnnotations,
    addHighlightClickListeners,
    selectAll,
    selectNone,
    filterAnnotationsByWitnesses,
    highlightTargetsLevel0,
    enableSingleSelectMode,
    disableSingleSelectMode,
    activateAnnotationsByIds,
    deactivateAnnotationsByIds,
    addVisibleAnnotations,
    removeVisibleAnnotations
  }

})
