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
import { hasItems, hasManifests } from '@/utils/api-validate.ts'
import { SidebarScroller } from '@/utils/sidebar-scroller.ts'

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
  annotationsError: CustomError | null
}

interface PanelProviderProps {
  children?: ReactNode
  panelId: string
}

export class CustomError extends Error {
  constructor(title, message) {
    super(message)
    this.name = title
  }
}

const PanelProvider: FC<PanelProviderProps> = ({ children, panelId }) => {
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
  const [annotationsMode, setAnnotationsMode] = useState<'list' | 'align'>('align')
  const sidebarScroller = useRef<SidebarScroller>(null)
  const [error, setError] = useState<CustomError>(null)
  const [annotationsError, setAnnotationsError] = useState<CustomError>(null)

  const { t } = useTranslation()

  const getCollection = useDataStore(state => state.initCollection)
  const { annotationsMode: initialAnnotationsMode } = useConfig()

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
    try {
      // Retrieve text data
      // Trickle down from collection to item
      const collection = await getCollection(config.collection)
      if (!hasManifests(collection)) {
        setError(new CustomError(t('panel_init_error'), t('error_contains_no_manifests', { url: config.collection })))
        return
      }

      if (config.manifestIndex === -1) {
        setError(new CustomError(t('panel_init_error'), t('manifest_not_found')))
        return
      }

      if (config.itemIndex === -1) {
        setError(new CustomError(t('panel_init_error'), t('item_not_found')))
        return
      }

      const manifestUrl = collection.sequence[config.manifestIndex ?? 0].id
      const manifest = await apiRequest<Manifest>(manifestUrl)
      if (!hasItems(manifest)) {
        setError(new CustomError(t('panel_init_error'), t('error_contains_no_items', { url: manifestUrl })))
        return
      }

      const item = await apiRequest<Item>(manifest.sequence[config.itemIndex ?? 0].id)

      const contentTypes: string[] = getContentTypes(item.content)

      const { support } = manifest

      if (support && support.length > 0 && isNewManifest(manifest)) {
        // Support can be loaded for a new manifest
        await getSupport(support)
      }

      const imageExists = validateImage(item)

      updatePanel({
        collectionId: collection.id,
        manifest,
        item,
        mode: getPanelMode(imageExists, 'text'),
        contentTypes,
        activeTargetIndex: -1,
        imageExists
      })

      // initialize AnnotationsMode
      if (!annotationsMode) setAnnotationsMode(initialAnnotationsMode)

      if (item.annotationCollection) {
        // Retrieve annotation data
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
        }
      }
    } catch (e) {
      if (e.name)
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
    setResizer(new PanelResizer(el, panelState.mode))
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
      annotationsError
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
