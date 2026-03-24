import { ReactNode, createContext, useContext, useState, FC, useEffect, useRef, SetStateAction, Dispatch } from 'react'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import { getSelectedTypes, isFiltered } from '@/utils/annotations.ts'
import { apiRequest, getAnnotationPage, getFirstItem, getFirstManifest } from '@/utils/api.ts'
import { getContentTypes, isNewManifest } from '@/utils/panel.ts'
import { getSupport } from '@/utils/support-styling.ts'
import { PanelResizer } from '@/utils/panel-resizer.ts'
import { AnnotationFiltersConfig, PanelConfig, PanelView } from '@/types'
import { useTranslation, UseTranslationResponse } from 'react-i18next'
import { getCollectionSlug } from '@/utils/tree.ts'
import { setColors } from '@/utils/witness-colors.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { isCollectionUrl, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { SidebarScroller } from '@/utils/sidebar-scroller.ts'
import { CustomError } from '@/utils/custom-error.ts'

const PanelContext = createContext<PanelContextType | undefined>(undefined)

interface PanelContextType {
  panelId: string
  panelState: PanelState
  loading: boolean
  updatePanel: (data: Partial<PanelState>) => void
  remove: () => void
  resizer: PanelResizer
  initResizer: (el: HTMLElement) => void
  hoveredAnnotation: string | null
  setHoveredAnnotation: (value: string | null) => void,
  annotationFilters: AnnotationFiltersConfig,
  setAnnotationFilters:  Dispatch<SetStateAction<AnnotationFiltersConfig>>,
  selectedAnnotationTypes: AnnotationTypesDict | null,
  setSelectedAnnotationTypes: (value: AnnotationTypesDict) => void,
  selectedAnnotation: Annotation | null,
  setSelectedAnnotation: (value: Annotation | null) => void
  showTextOptions: boolean,
  setShowTextOptions: (value: boolean) => void,
  usePanelTranslation: () =>  UseTranslationResponse<'common', undefined>
  witnesses: WitnessWithColor[]
  selectedWitnesses: WitnessWithColor[]
  setSelectedWitnesses: (witnesses: WitnessWithColor[]) => void
  init: (config: PanelConfig) => void,
  annotationsMode: AnnotationsMode,
  setAnnotationsMode: (mode: AnnotationsMode) => void,
  getSidebarScroller: () => SidebarScroller,
  error: CustomError | null,
  annotationsError: CustomError | null,
  annotationsLoading: boolean
  matchedAnnotationsMaps: {[contentUrl: string]: MatchedAnnotationsMap}
  updateMatchedAnnotationsMap: (contentUrl: string, map: MatchedAnnotationsMap) => void
}

interface PanelProviderProps {
  children?: ReactNode
  panelId: string,
  onLoaded?: () => void,
}

const PanelProvider: FC<PanelProviderProps> = ({ children, panelId, onLoaded }) => {
  const { annotations: annotationsConfig, panelViews: panelViewsConfig } = useConfig()

  const [loading, setLoading] = useState(true)
  const [resizer, setResizer] = useState<PanelResizer | null>(null)
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null)
  const [matchedAnnotationsMaps, setMatchedAnnotationsMaps] = useState<{[contentUrl: string]: MatchedAnnotationsMap}>({})
  const [annotationFilters, setAnnotationFilters] = useState<AnnotationFiltersConfig>(null)
  const [selectedAnnotationTypes, setSelectedAnnotationTypes] = useState(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const [showTextOptions, setShowTextOptions] = useState(false)
  const [witnesses, setWitnesses] = useState<WitnessWithColor[]>([])
  const [selectedWitnesses, setSelectedWitnesses] = useState<WitnessWithColor[]>([])
  const [annotationsMode, setAnnotationsMode] = useState<AnnotationsMode>(annotationsConfig.singleMode ?? annotationsConfig.defaultMode)
  const [error, setError] = useState<CustomError>(null)
  const [annotationsError, setAnnotationsError] = useState<CustomError>(null)
  const sidebarScroller = useRef<SidebarScroller>(null)
  const [annotationsLoading, setAnnotationsLoading] = useState(false)

  const { t } = useTranslation()

  const getCollection = useDataStore(state => state.initCollection)
  const panelState = usePanelStore(state => state.getPanel(panelId))

  function usePanelTranslation(): UseTranslationResponse<'common', never> {
    const ns = panelState.collectionId ? getCollectionSlug(panelState.collectionId) : 'common'
    return useTranslation(ns)
  }

  async function init(config: PanelConfig) {
    setLoading(true)
    setAnnotationsLoading(true)
    setError(null)
    setAnnotationsError(null)
    setMatchedAnnotationsMaps({})

    if (!annotationsConfig.filters) {
      // We have to reset the selected types if no filters config is given, in order to re-discover types again on-the-fly.
      // TODO: This way maintaining selected types thoughout item change is not possible. We need a way to fix this.
      setSelectedAnnotationTypes(null)
    }

    try {
      let item: Item, manifest: Manifest, collection: Collection

      // 1. Load anything we can see in the config.
      if (config.item) {
        if (isItemUrl(config.item)) item = await apiRequest<Item>(config.item)
        else {
          setError(new CustomError(t('panel_init_error'), t('error_invalid_item_url', { url: config.item })))
          return
        }
      }

      if (config.manifest) {
        if (isManifestUrl(config.manifest)) manifest = await apiRequest<Manifest>(config.manifest)
        else {
          setError(new CustomError(t('panel_init_error'), t('error_invalid_manifest_url', { url: config.manifest })))
          return
        }
      }

      if (config.collection) {
        if (isCollectionUrl(config.collection)) collection = await getCollection(config.collection)
        else {
          setError(new CustomError(t('panel_init_error'), t('error_invalid_collection_url', { url: config.collection })))
          return
        }
      }

      // 2. Analyze the received data and try load as much as possible.
      // When a resource is missing, load the first one from the parent sequence.
      if (item) {
        if (collection && !manifest) manifest = await getFirstManifest(collection)
      } else {
        if (!collection && !manifest) {
          setError(new CustomError(t('panel_init_error'), t('something_went_completely_wrong')))
          return
        }

        if (manifest) {
          item = await getFirstItem(manifest)
        } else if (collection) {
          manifest = await getFirstManifest(collection)
          item = await getFirstItem(manifest)
        }
      }

      // 3. At this point "item" should exist, so we continue to load content from it.
      const contentTypes = getContentTypes(item.content)

      if (contentTypes.length === 0) {
        setError(new CustomError(t('panel_init_error'), t('error_no_supported_content_types')))
        return
      }

      const { support } = manifest

      if (support && support.length > 0 && isNewManifest(manifest)) {
        // Support can be loaded for a new manifest
        await getSupport(support)
      }

      // 4. We discover the correct "views" config. This can come from a global config (root key "panelViews")
      // or local config (key "views" in the panel config).
      const resultPanelViews: PanelView[] = (panelViewsConfig as PanelView[])
        .map((globalPanelView, i) => {
          return {
            ...globalPanelView,
            ...(config.views?.[i] ?? {}),
          }
        })
        .map(v => {
          if (v.view === 'text' && !v.contentTypes) {
            v.contentTypes = contentTypes
          }
          return v
        })
        .map(v => ({ ...v, visible: v.visible ?? true }))

      // 5. We update the panel state with the data.
      updatePanel({
        collectionId: collection?.id ?? null,
        manifest,
        item,
        activeTargetIndex: -1,
        panelViews: resultPanelViews
      })

      if (item.annotationCollection) {
        // 6. Retrieve annotation data
        // Get an array of annotations and set up the witnesses
        // Update annotations data separately for progressive loading (still show text if annotations are broken)

        try {
          const page = await getAnnotationPage(item.annotationCollection)
          const annotations = page.items ?? []
          const witnesses = page.partOf.refs ?? []

          if (witnesses.length > 0) {
            const witnessesWithColor = setColors(witnesses)
            setWitnesses(witnessesWithColor)
            setSelectedWitnesses(witnessesWithColor)
          }
          updatePanel({ annotations })
        } catch (e) {
          console.error(e)
          setAnnotationsError(e)
        } finally {
          setTimeout(() => setAnnotationsLoading(false), 500)
        }
      } else {
        setAnnotationsLoading(false)
      }
    } catch (e) {
      console.error(e)
      setError(new CustomError(t('panel_init_error'), e.message))
    } finally {
      // add a timeout to wait until updatePanel() is finished
      setTimeout(() => {
        onLoaded()
        setLoading(false)
      }, 100)
    }
  }

  function updateMatchedAnnotationsMap(contentUrl: string, map: MatchedAnnotationsMap) {
    setMatchedAnnotationsMaps((prev) => {
      if (map === null) {
        if (prev[contentUrl]) {
          // When annotations from the given content url should disappear, remove that key and return the rest
          return Object.keys(prev).reduce((acc: {[contentUrl: string]: MatchedAnnotationsMap}, key) => {
            if (key !== contentUrl) acc[key] = prev[key]
            return acc
          }, {})
        }
        // If the given content url was present at all and the caller is trying to add "null" as map,
        // avoid it and return the old value
        return prev
      }

      // If a new value for a map exists, just update it
      return {
        ...prev,
        [contentUrl]: map
      }
    })
  }

  useEffect(() => {
    if (annotationsConfig.filters) {
      setAnnotationFilters(annotationsConfig.filters)
      setSelectedAnnotationTypes(getSelectedTypes(annotationsConfig.filters.items))
    }
  }, [])

  useEffect(() => {
    init(panelState.config)
  }, [panelState.config, panelId])

  useEffect(() => {
    const resultMap: {[contentUrl: string]: MatchedAnnotationsMap} = {}
    if (selectedAnnotationTypes) {
      Object
        .keys(matchedAnnotationsMaps)
        .forEach(contentUrl => {
          const map = matchedAnnotationsMaps[contentUrl]
          resultMap[contentUrl] = { ...map }

          Object.keys(map).forEach(id => {
            const { annotation } = map[id]
            resultMap[contentUrl][id].filtered = isFiltered(annotation, selectedAnnotationTypes)
          })
        })
    }

    setMatchedAnnotationsMaps(resultMap)
  }, [selectedAnnotationTypes])

  useEffect(() => {
    // This is for the case where no specific annotation filters were configured.
    // We extract all occurring types from the annotations that match the text.
    if (annotationsConfig.filters) return

    const types = Object
      .values(matchedAnnotationsMaps)
      .flatMap(map => Object.values(map))
      .map(item => item.annotation.body['x-content-type'])

    if (types.length === 0) return

    const uniqueAnnotationTypes = [...new Set(types)]

    setAnnotationFilters({
      rootSelectionRule: 'multiple',
      items: uniqueAnnotationTypes.map(type => ({ types: [type], selected: true }))
    })
  }, [matchedAnnotationsMaps])

  function updatePanel(data: Partial<PanelState>) {
    usePanelStore.getState().updatePanel(panelId, data)
  }

  function remove() {
    usePanelStore.getState().removePanel(panelId)
  }

  function initResizer(el: HTMLElement) {
    setResizer(new PanelResizer(el))
  }

  function getSidebarScroller() {
    if (!sidebarScroller.current) {
      sidebarScroller.current = new SidebarScroller()
    }
    return sidebarScroller.current
  }

  return (
    <PanelContext.Provider value={{
      panelId,
      panelState,
      updatePanel,
      loading,
      remove,
      resizer,
      initResizer,
      hoveredAnnotation,
      setHoveredAnnotation,
      annotationFilters,
      setAnnotationFilters,
      selectedAnnotationTypes,
      setSelectedAnnotationTypes,
      selectedAnnotation,
      setSelectedAnnotation,
      showTextOptions,
      setShowTextOptions,
      usePanelTranslation,
      witnesses,
      selectedWitnesses,
      setSelectedWitnesses,
      init,
      annotationsMode,
      setAnnotationsMode,
      getSidebarScroller,
      error,
      annotationsError,
      annotationsLoading,
      matchedAnnotationsMaps,
      updateMatchedAnnotationsMap
    }}>
      {children}
    </PanelContext.Provider>
  )
}

function usePanel(): PanelContextType {
  const context =  useContext(PanelContext)
  if (!context) {
    throw new Error('usePanel must be used inside the PanelProvider')
  }

  return context
}

export { PanelProvider, usePanel }
