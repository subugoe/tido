import React from 'react'

declare global {
  declare module '*.css';

  type AnnotationsMode = 'aligned' | 'list'

  interface AnnotationCollection {
    id: string
    first: string
    label: string
    type: string
  }

  interface AnnotationPage {
    partOf: {
      id: string
      label: string
      refs: Witness[]
    }
    items: Annotation[]
  }

  interface Witness {
    idno: string
    idnoAlt: string
    title: string
  }

  interface WitnessWithColor extends Witness {
    bgColor: string
    color: string
  }


  interface Annotation {
    body: AnnotationBody | AnnotationBodyCrossRef
    target: AnnotationTarget[]
    type: string
    id: string
  }

  interface AnnotationBody {
    type: 'TextualBody'
    value: string
    format: AnnotationContentFormat
    'x-content-type': string
    witnesses?: string[]
  }

  interface AnnotationBodyCrossRef {
    source: {
      id: string,
      collection: string,
      manifest: string,
      item: string,
      'x-content-type': string,
    },
    selector?: CssSelector
  }

  type AnnotationContentFormat = 'text/plain' | 'text/html'

  interface AnnotationTargetSource {
    id: string
    collection?: string
    manifest?: string
    item?: string
  }

  interface AnnotationTarget {
    selector: CssSelector | RangeSelector
    format: string
    language?: string
    source: string | AnnotationTargetSource
    motivation?: string
  }

  interface AnnotationTypesDict {
    [annotationType: string]: string[]
  }

  interface Content {
    id: string
    contentType: string
    integrity: DataIntegrity | null
  }

  type CssSelector = {
    type: 'CssSelector'
    value: string
  }

  interface CrossRefInfo {
    collection: string,
    manifest: string,
    item: string,
    contentType: string,
    refItemData: Item,
    selector?: string,
    selectedAnnotation?: Annotation,
    manifestLabel?: string,
    itemLabel?: string,
    textType: 'text' | 'annotation',     // referenced text
  }

  interface DataIntegrity {
    type: string
    value: string
  }

  interface PanelState {
    id: string
    collectionId: string | null
    manifest: Manifest | null
    item: Item | null
    imageUrl?: string
    activeTargetIndex: number
    config: PanelConfig
    showSidebar: boolean
    selectedAnnotation?: Annotation
    panelViews: PanelView[]
    contentTypes: string[]
  }


  // we want nestedMatchedAnnotationsMap to be accessible to every annotation.
  // since some childAnnotations are not mounted yet, we can't know the HTMLElement of their targets
  // We would need to maintain 'target': Element[] synchronized among all annotations -> that would require to update
  // state `nestedMatchedAnnotationsMap`, which is not a good practice.
  // Therefore, let's keep `target`: string[], also an Array of selectors
  interface MatchedAnnotationsMap {
    [annotationId: string]: {
      target: Element[],
      filtered?: boolean,
      annotation: Annotation,
      nestedAnnotations: Annotation[]
    }
  }

  interface MergedAnnotationEntry {
    target: Element
    annotations: Annotation[]
    filtered: boolean[],
    parents: Element[]
  }

  interface SyncMap {
    [source: string]: Element[]
  }

  type RangeSelector = {
    type: 'RangeSelector'
    startSelector: CssSelector
    endSelector: CssSelector
  }

  interface Asset {
    id: string
    assetType: string
    contentType: string
    type: string
    integrity?: DataIntegrity
  }

  type SuccessResponse<T> = {
    success: true
    data: T
  }

  type ErrorResponse = {
    success: false
    message: string
    code: number
  }

  type HttpResponse<T> = SuccessResponse<T> | ErrorResponse

  interface TreeNode {
    id: string,
    key: string
    label: string,
    type: string,
    leaf?: boolean,
    expanded?: boolean,
    children: TreeNode[]
  }

  interface CollectionMap {
    [key: string]: Collection
  }
}

export interface PanelConfig {
  collection: string
  manifest?: string
  item?: string,
  views?: PanelView[]
  selectedAnnotation?: string
  showSidebar?: boolean
}

export type PanelViewType = 'text' | 'image'

export interface PanelView {
  activeContentType?: string
  contentTypes?: string[]
  label?: string
  view: PanelViewType
  visible?: boolean
}

export interface ThemeConfig {
  primaryColor: string,
  theme: 'light' | 'dark' | 'system'
}


export interface Translation {
  [key: string]: string
}
export interface TranslationNamespace {
  [key: 'common' | string]: Translation
}

export interface TranslationsConfig {
  [key: string]: TranslationNamespace
}

export interface TidoConfig {
  allowNewCollections: boolean
  container: string
  lang: string
  rootCollections: string[]
  showAddNewPanelButton: boolean
  showContentTypeToggle: boolean
  showGlobalTree: boolean
  showPanelPlaceholder: boolean
  showThemeToggle: boolean
  showCrossRefLabels: boolean
  panels: PanelConfig[]
  theme: ThemeConfig
  title: string
  translations: TranslationsConfig,
  panelViews: PanelView[],
  annotations: AnnotationsConfig
}


export interface AnnotationTypeConfig {
  label?: string
}

export interface AnnotationTypeConfigMap {
  [type: string]: AnnotationTypeConfig
}

export interface AnnotationsConfig {
  filters?: AnnotationFiltersConfig
  types?: AnnotationTypeConfigMap,
  tooltipTypes?: string[]
  singleMode?: AnnotationsMode,
  defaultMode?: AnnotationsMode,
  crossRefContentType?: string
}

export interface AnnotationFiltersConfig {
  rootSelectionRule: SelectionRule
  selectedIndex?: number
  items: FilterNode[]
}

export type VariantType = { Variant: string }
export type FilterType = string | VariantType

export interface FilterNode {
  types?: FilterType[]
  label?: string
  items?: FilterNode[]
}

export interface FilterNodeWithSelection extends FilterNode {
  selected?: boolean
}

export interface TidoProps {
  config: Partial<TidoConfig>,
  onReady?: () => void;
  theme?: ThemeConfig.theme,
  onThemeChange?: (theme: ThemeConfig.theme) => void;
}

export interface TidoContentState {
  type: 'Annotation'
  motivation: ['contentState']
  target: TidoContentStateTarget[]
}

export interface TidoContentStateTarget {
  id: string
  type: 'Item' | 'Manifest' | 'Collection'
  partOf?: TidoContentStateTarget
  state?: {
    views?: PanelViewContentState[]
    annotation?: string
  }
}

export interface PanelViewContentState {
  visible: boolean
  active?: string
}

export type SelectionRule = 'single' | 'multiple'

export interface TidoInstance {
  onReady?: () => void,
  setTheme?: (newTheme: ThemeConfig.theme) => void,
  onThemeChange?: (newTheme: ThemeConfig.theme) => void,
}
export declare class Tido extends React.Component<TidoProps, never> {}
export declare function encodeState(state: TidoContentState): Promise<string>
export declare function decodeState(encoded: string): Promise<TidoContentState>

export {}
