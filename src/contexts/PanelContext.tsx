import { ReactNode, createContext, useContext, useState, FC, useEffect, useRef } from 'react'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import { getExtendedFullAnnotationsTypesMap } from '@/utils/annotations.ts'
import { apiRequest } from '@/utils/api.ts'
import { getContentTypes, isNewManifest, validateImage } from '@/utils/panel.ts'
import { getSupport } from '@/utils/support-styling.ts'
import { PanelResizer } from '@/utils/panel-resizer.ts'
import { PanelConfig, PanelMode } from '@/types'
import { useTranslation, UseTranslationResponse } from 'react-i18next'
import { getCollectionSlug } from '@/utils/tree.ts'
import { setColors } from '@/utils/witness-colors.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { hasItems, hasManifests, isCollectionUrl, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { SidebarScroller } from '@/utils/sidebar-scroller.ts'
import { CustomError } from '@/utils/custom-error.ts'

const PanelContext = createContext<PanelContentType | undefined>(undefined)

interface PanelContentType {
  panelId: string
  panelState: PanelState
  loading: boolean
  updatePanel: (data: Partial<PanelState>) => void
  remove: () => void
  resizer: PanelResizer
  initResizer: (el: HTMLElement) => void
  hoveredAnnotation: string | null
  setHoveredAnnotation: (value: string | null) => void,
  matchedAnnotationsMap: MatchedAnnotationsMap,
  setMatchedAnnotationsMap: (value: MatchedAnnotationsMap) => void,
  fullAnnotationTypes: AnnotationTypesDict | null,
  setFullAnnotationTypes: (value: AnnotationTypesDict) => void,
  selectedAnnotation: Annotation | null,
  setSelectedAnnotation: (value: Annotation | null) => void
  showTextOptions: boolean,
  setShowTextOptions: (value: boolean) => void,
  usePanelTranslation: () =>  UseTranslationResponse<'common', undefined>
  textWarning: string
  setTextWarning: (warning: string) => void,
  witnesses: WitnessWithColor[]
  selectedWitnesses: WitnessWithColor[]
  setSelectedWitnesses: (witnesses: WitnessWithColor[]) => void
  init: (config: PanelConfig) => void,
  annotationsMode: 'align' | 'list',
  setAnnotationsMode: (mode: 'align' | 'list') => void,
  getSidebarScroller: () => SidebarScroller,
  error: CustomError | null,
  annotationsError: CustomError | null,
  annotationsLoading: boolean
}

interface PanelProviderProps {
  children?: ReactNode
  panelId: string
}

const PanelProvider: FC<PanelProviderProps> = ({ children, panelId }) => {
  const { defaultAnnotationsMode } = useConfig()

  const [annotationsMode, setAnnotationsMode] = useState<'list' | 'align'>(defaultAnnotationsMode)
  const [loading, setLoading] = useState(true)
  const [resizer, setResizer] = useState<PanelResizer | null>(null)
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null)
  const [matchedAnnotationsMap, setMatchedAnnotationsMap] = useState({})
  const [fullAnnotationTypes, setFullAnnotationTypes] = useState({})
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const [showTextOptions, setShowTextOptions] = useState(false)
  const [textWarning, setTextWarning] = useState('')
  const [witnesses, setWitnesses] = useState<WitnessWithColor[]>([])
  const [selectedWitnesses, setSelectedWitnesses] = useState<WitnessWithColor[]>([])
  const [error, setError] = useState<CustomError>(null)
  const [annotationsError, setAnnotationsError] = useState<CustomError>(null)
  const sidebarScroller = useRef<SidebarScroller>(null)
  const [annotationsLoading, setAnnotationsLoading] = useState(false)

  const { t } = useTranslation()

  const getCollection = useDataStore(state => state.initCollection)

  const panelState = usePanelStore(state => state.getPanel(panelId))

  function getPanelMode(existsImage: boolean, panelMode: PanelMode) {
    if (existsImage) return panelState.mode
    return panelMode
  }

  function usePanelTranslation(): UseTranslationResponse<'common', never> {
    const ns = panelState.collectionId ? getCollectionSlug(panelState.collectionId) : 'common'
    return useTranslation(ns)
  }

  async function getAnnotationPage(annotationCollectionUrl: string): Promise<AnnotationPage> {
    const collection: AnnotationCollection = await apiRequest<AnnotationCollection>(annotationCollectionUrl)
    if (typeof collection !== 'object' || !Object.hasOwn(collection, 'first')) {
      throw new CustomError(t('annotations_init_error'), t('annotation_collection_response_error'))
    }
    return await apiRequest<AnnotationPage>(collection.first)
  }

  async function init(config: PanelConfig) {
    setLoading(true)
    setAnnotationsLoading(true)
    setError(null)
    setAnnotationsError(null)
    setMatchedAnnotationsMap({})
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
        if (collection && !manifest) await getFirstManifest()
      } else {
        if (!collection && !manifest) {
          setError(new CustomError(t('panel_init_error'), t('something_went_completely_wrong')))
          return
        }

        if (manifest) {
          await getFirstItem()
        } else if (collection) {
          await getFirstManifest()
          await getFirstItem()
        }
      }

      async function getFirstManifest() {
        if (!hasManifests(collection)) {
          throw new CustomError(t('panel_init_error'), t('error_contains_no_manifests', { url: config.collection }))
        }

        const first = collection.sequence[0].id
        if (!isManifestUrl(first)) {
          throw new CustomError(t('panel_init_error'), t('error_invalid_manifest_url', { url: first }))
        }

        manifest = await apiRequest<Manifest>(first)
      }

      async function getFirstItem() {
        if (!hasItems(manifest)) {
          throw new CustomError(t('panel_init_error'), t('error_contains_no_items', { url: manifest.id }))
        }

        const first = manifest.sequence[0].id
        if (!isItemUrl(first)) {
          throw new CustomError(t('panel_init_error'), t('error_invalid_item_url', { url: first }))
        }

        item = await apiRequest<Item>(manifest.sequence[0].id)
      }


      // 3. At this point "item" should exist, so we continue to load content from it.
      const contentTypes: string[] = getContentTypes(item.content)

      if (contentTypes.length === 0) {
        setError(new CustomError(t('panel_init_error'), t('error_no_supported_content_types')))
        return
      }

      const { support } = manifest

      if (support && support.length > 0 && isNewManifest(manifest)) {
        // Support can be loaded for a new manifest
        await getSupport(support)
      }

      const imageExists = validateImage(item)

      // 4. We update the panel state with the data.
      updatePanel({
        collectionId: collection.id,
        manifest,
        item,
        mode: getPanelMode(imageExists, 'text'),
        contentTypes,
        activeContentType: config.contentType ?? contentTypes[0],
        activeTargetIndex: -1,
        imageExists
      })

      if (item.annotationCollection) {
        // 5. Retrieve annotation data
        // Get an array of annotations and set up the witnesses
        // Update annotations data separately for progressive loading (still show text if annotations are broken)

        try {
          const page = await getAnnotationPage(item.annotationCollection)
          const annotations = page.items ?? []
          const witnesses = page.refs ?? []

          const extendedFullAnnotationsTypesMap = getExtendedFullAnnotationsTypesMap(annotations, fullAnnotationTypes)
          setFullAnnotationTypes(extendedFullAnnotationsTypesMap)

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
        setLoading(false)
      }, 100)
    }
  }

  useEffect(() => {
    const showText = panelState.mode !== 'image'
    setShowTextOptions(showText && panelState.contentTypes.length > 1)
  }, [panelState.mode, panelState.contentTypes])

  useEffect(() => {
    init(panelState.config)
  }, [panelState.config, panelId])

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
      matchedAnnotationsMap,
      setMatchedAnnotationsMap,
      fullAnnotationTypes,
      setFullAnnotationTypes,
      selectedAnnotation,
      setSelectedAnnotation,
      showTextOptions,
      setShowTextOptions,
      usePanelTranslation,
      textWarning,
      setTextWarning,
      witnesses,
      selectedWitnesses,
      setSelectedWitnesses,
      init,
      annotationsMode,
      setAnnotationsMode,
      getSidebarScroller,
      error,
      annotationsError,
      annotationsLoading
    }}>
      {children}
    </PanelContext.Provider>
  )
}

function usePanel(): PanelContentType {
  const context =  useContext(PanelContext)
  if (!context) {
    throw new Error('usePanel must be used inside the PanelProvider')
  }

  return context
}

export { PanelProvider, usePanel }
