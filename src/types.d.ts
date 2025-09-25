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
    items: Annotation[]
    refs: Witness[]
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
    value: string | AnnotationVariantValue
    format: AnnotationContentFormat
    'x-content-type': string
  }

  type AnnotationContentFormat = 'text/plain' | 'text/html'

  interface AnnotationTarget {
    selector: CssSelector | RangeSelector
    format: string
    language: string
    source: string
  }

  interface AnnotationType {
    name: string
    icon?: string
    annotationType?: string
    displayWhen?: string
  }

  interface AnnotationTypesDict {
    [key: AnnotationType]: boolean
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
    contentIndex: number
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
    [key: string]: {
      target: AnnotationTarget[],
      filtered: boolean,
      annotation: Annotation
    }
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
    [key: string]: {
      slug: string,
      collection: Collection
    }
  }

  interface Position {
    x: number,
    y: number
  }
}

export interface PanelConfig {
  collection: string
  manifestIndex?: number
  itemIndex?: number,
  contentIndex?: number,
  mode?: PanelMode,
  annotationsMode?: 'align' | 'list'
}

export type PanelMode = 'swap' | 'split' | 'text' | 'image'

export interface PanelModeButtonData {
  mode: PanelMode,
  icon: React.Element,
  title: string
}

export interface ThemeConfig {
  forcePanelMode?: string
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
  annotationsMode: 'align' | 'list',
  useCrossRef: boolean
}

export interface TidoProps {
  config: Partial<TidoConfig>
}

export declare class Tido extends React.Component<TidoProps, never> {}

export {}
