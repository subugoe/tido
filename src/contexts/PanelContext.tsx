import { ReactNode, createContext, useContext, useState, FC, useEffect } from 'react'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import { toast } from 'sonner'

import { selectSyncTargetByIndex } from '@/utils/annotations.ts'
import { apiRequest } from '@/utils/api.ts'
import { getContentTypes, isNewManifest, validateImage } from '@/utils/panel.ts'
import { getSupport } from '@/utils/support-styling.ts'
import { PanelResizer } from '@/utils/panel-resizer.ts'
import { PanelMode } from '@/types'
import { useTranslation, UseTranslationResponse } from 'react-i18next'
import { getCollectionSlug } from '@/utils/tree.ts'

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
  showTextOptions: boolean
  usePanelTranslation: () =>  UseTranslationResponse<'common', undefined>
  textWarning: string
  setTextWarning: (warning: string) => void
}

interface PanelProviderProps {
  children?: ReactNode
  panelId: string
}

class CustomError extends Error {
  constructor(title, message) {
    super(message)
    this.name = title
  }
}

async function getAnnotations(annotationCollectionUrl: string): Promise<Annotation[]> {
  const collection: AnnotationCollection = await apiRequest<AnnotationCollection>(annotationCollectionUrl)
  if (typeof collection !== 'object' || !Object.hasOwn(collection, 'first')) {
    throw new CustomError('Annotation collection error', 'Annotation collection content is not provided correctly in panel')
  }
  const page = await apiRequest<AnnotationPage>(collection.first)
  return page.items ?? []
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

  useEffect(() => {
    const showText = panelState.mode !== 'image'
    setShowTextOptions(showText && panelState.contentTypes.length > 1)
  }, [panelState.mode, panelState.contentTypes])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const collection = await getCollection(panelState.config.collection)
        const manifest = await apiRequest<Manifest>(collection.sequence[panelState.config.manifestIndex ?? 0].id)
        const item = await apiRequest<Item>(manifest.sequence[panelState.config.itemIndex ?? 0].id)

        const contentTypes: string[] = getContentTypes(item.content)

        const { support } = manifest

        if (support && support.length > 0 && isNewManifest(manifest)) {
          // Support can be loaded for a new manifest
          await getSupport(support)
        }

        const imageExists = validateImage(item)

        updatePanel( {
          collectionId: collection.id,
          manifest,
          item,
          mode: getPanelMode(imageExists, 'text'),
          contentTypes,
          activeTargetIndex: -1,
          imageExists,
        })

        let annotations = null
        if (item.annotationCollection) {
          annotations = await getAnnotations(item.annotationCollection)
          updatePanel({ annotations })
        }

      } catch (e) {
        toast.error(e.name, { description: e.message })
      } finally {
        // add a timeout, since loading is finished when updatePanel() is finished
        setTimeout(() => {
          setLoading(false)
        }, 100)
      }
    }
    init()
  }, [panelState.config, panelId])


  useEffect(() => {
    if (!panelId || !panelState) return
    if (panelState.activeTargetIndex > -1) selectSyncTargetByIndex(panelId, panelState.activeTargetIndex)
  }, [panelState?.activeTargetIndex])

  function updatePanel(data: Partial<PanelState>) {
    usePanelStore.getState().updatePanel(panelId, data)
  }

  function remove() {
    usePanelStore.getState().removePanel(panelId)
  }

  function initResizer(el: HTMLElement) {
    // The resizer handles render-intensive style updates, e.g. width updates on drag.
    // Each panel creates an own instance.
    // The initResizer function is called either to init or re-init the resizer.
    // On re-init, we want to keep some settings from previous user interaction,
    // that is why we call handleTextUpdate
    if (!resizer) setResizer(new PanelResizer(el, panelState.mode))
    else resizer.handleTextUpdate()
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
      usePanelTranslation,
      textWarning,
      setTextWarning
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
