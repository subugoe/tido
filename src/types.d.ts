import React from 'react'

declare global {
  declare module '*.css';

  interface ActiveAnnotation {
    [key: string]: Annotation
  }

  interface Actor {
    '@context': string
    role: string[]
    name: string
    id?: string
    idref?: Idref[]
  }

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
    body: AnnotationBody
    target: AnnotationTarget[]
    type: string
    id: string
  }

  interface AnnotationVariantValue {
    witnesses: string[],
    entry: string
  }

  interface AnnotationBody {
    type: 'TextualBody'
    value: string
    format: AnnotationContentFormat
    'x-content-type': string
    witnesses?: string[]
  }

  type AnnotationContentFormat = 'text/plain' | 'text/html'

  interface AnnotationTarget {
    selector: CssSelector | RangeSelector
    format: string
    language: string
    source: string
  }

  interface AnnotationType {
    label: string
    icon?: string
    value?: string
  }

  interface AnnotationTypesDict {
    [annotationType: string]: string[]
  }

  interface Collection {
    '@context': string
    textapi: string
    id: string
    title: Title[]
    collector: Actor[]
    description?: string
    sequence: Sequence[]
    total?: number
    annotationCollection?: string
    modules?: Module[]
  }


  interface Content {
    '@context': string
    url: string
    type: string
    integrity?: DataIntegrity
  }

  type CssSelector = {
    type: 'CssSelector'
    value: string
  }

  interface DataIntegrity {
    type: string
    value: string
  }

  interface Entrypoint {
    url: string
    type: string
  }

  interface Header {
    show: boolean
    navigation: boolean
    panelsToggle: boolean
    languageSwitch: boolean
  }

  interface Idref {
    '@context': string
    base?: string
    type: string
    id: string
  }

  interface Image {
    '@context': string
    id: string
    manifest?: string
    license: License
  }

  interface Item {
    '@context': string
    textapi: string
    id: string
    title?: Title[]
    type: ItemType
    n?: string
    lang: ItemLangCode[]
    langAlt?: string[]
    content: Content[]
    description?: string
    image?: Image
    annotationCollection?: string
    modules?: Module[]
  }

  interface PanelState {
    id: string
    collectionId: string | null
    manifest: Manifest | null
    item: Item | null
    contentTypes: string[]
    activeContentType: string
    mode: PanelMode
    imageUrl?: string
    activeTargetIndex: number
    config: PanelConfig
    imageExists: boolean
    annotationsOpen: boolean
    annotations: Annotation[] | null
  }

  type ItemType = 'section' | 'page' | 'full'
  type ItemLangCode =
    | 'eng'
    | 'fra'
    | 'deu'
    | 'ara'
    | 'arb'
    | 'arz'
    | 'apc'
    | 'acm'
    | 'zho'
    | 'cmn'
    | 'yue'
    | 'nan'
    | 'tha'
    | 'sou'
    | 'nod'
    | 'khb'
    | 'lao/tts'
    | 'pht'

  interface Labels {
    item: string
    manifest?: string
  }

  interface License {
    id: string
    notes?: string
  }

  interface Manifest {
    '@context': string
    textapi: string
    id: string
    label: string
    sequence: Sequence[]
    total?: number
    actor?: Actor[]
    repository?: Repository[]
    image?: Image
    metadata?: Metadata[]
    support?: Support[]
    license: License[]
    description?: string
    annotationCollection?: string
    modules?: Module[]
  }

  interface MatchedAnnotationsMap {
    [annotationId: string]: {
      target: Element[],
      filtered: boolean,
      annotation: Annotation
    }
  }

  interface MergedAnnotationEntry {
    target: Element
    annotations: Annotation[]
    filtered: boolean[],
    selectedAnnotationIndex: number,
    parents: Element[]
  }

  interface Metadata {
    key: string
    value?: string
    metadata?: Metadata[]
  }

  interface Module {
    editionManuscripts?: boolean
    editionPrints?: boolean
  }

  interface MessageBoxColors {
    info: string
    warning: string
  }



  type RangeSelector = {
    type: 'RangeSelector'
    startSelector: CssSelector
    endSelector: CssSelector
  }

  interface Repository {
    '@context': string
    label?: string
    url: string
    baseUrl: string
    id: string
  }

  interface Sequence {
    '@context': string
    id: string
    type: SequenceType
    label?: string
  }

  interface Support {
    '@context': string
    type: SupportType
    mime: string
    url: string
    integrity?: DataIntegrity
  }

  type SequenceType = 'collection' | 'manifest' | 'item'
  type SupportType = 'font' | 'css'

  interface Title {
    '@context': string
    title: string
    type: TitleType
  }

  type TitleType = 'main' | 'sub'

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

  interface Position {
    x: number,
    y: number
  }

  type AnnotationsMode = 'aligned' | 'list'
}

export interface PanelConfig {
  collection: string
  manifest?: string
  item?: string
  contentType?: string
  mode?: PanelMode
}

export type PanelMode = 'swap' | 'split' | 'text' | 'image'

export interface PanelModeButtonData {
  mode: PanelMode,
  icon: React.Element,
  title: string
}

export interface ThemeConfig {
  primaryColor: string
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
  defaultPanelMode: PanelMode
  lang: string
  rootCollections: string[]
  showAddNewPanelButton: boolean
  showGlobalTree: boolean
  showPanelPlaceholder: boolean
  showThemeToggle: boolean
  panels: PanelConfig[]
  theme: ThemeConfig
  title: string
  translations: TranslationsConfig,
  panelModes: PanelMode[],
  defaultAnnotationsMode: AnnotationsMode
  annotations: AnnotationsConfig
}

export interface AnnotationTypeConfig {
  label?: string
  icon?: string
}

export interface AnnotationsConfig {
  filters?: AnnotationFiltersConfig
  types?: {
    [type: string]: AnnotationTypeConfig
  }
}

export interface AnnotationFiltersConfig {
  rootSelectionRule: SelectionRule
  items: FilterNode[]
}

export interface FilterNode {
  types?: string[]
  label?: string
  selected?: boolean
  items?: FilterNode[]
}

export interface TidoProps {
  config: Partial<TidoConfig>
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
    mode?: PanelMode
    contentType?: string
  }
}

export type SelectionRule = 'single' | 'multiple'

export declare class Tido extends React.Component<TidoProps, never> {}
export declare function encodeState(state: TidoContentState): Promise<string>
export declare function decodeState(encoded: string): Promise<TidoContentState>

export {}
