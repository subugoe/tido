declare global {

  interface ActiveAnnotation {
    [key: string]: Annotation
  }

  interface Actor {
    '@context': string,
    role: string[],
    name: string,
    id?: string,
    idref?: Idref[]
  }

  interface AnnotationPage {
    items: Annotation[],
    refs: Witness[]
  }

  interface Witness {
    idno: string,
    idnoAlt: string,
    title: string
  }

  interface Annotation {
    body: AnnotationContent[],
    target: AnnotationTarget[],
    type: string,
    id: string
  }

  interface AnnotationContent {
    type: 'TextualBody',
    value: string | AnnotationVariantValue,
    format: AnnotationContentFormat,
    'x-content-type': AnnotationContentType
  }

  interface AnnotationVariantValue {
    witnesses: string[]
    entry: string
  }

  type AnnotationContentFormat = 'text/plain' | 'text/html'
  type AnnotationContentType = 'Person' | 'Place'

  interface AnnotationTarget {
    selector: CssSelector | RangeSelector,
    format: string,
    language: string,
    source: string
  }

  interface AnnotationType {
    name: string,
    icon?: string,
    annotationType?: string,
    displayWhen?: string
  }


  interface Collection {
    '@context': string,
    textapi: string,
    id: string,
    title: Title[]
    collector: Actor[],
    description?: string,
    sequence: Sequence[],
    total?: number,
    annotationCollection?: string,
    modules?: Module[]
  }

  interface Colors {
    forceMode: string,
    primary: string,
    secondary: string,
    accent: string
  }


  interface Content {
    '@context': string,
    url: string,
    type: string,
    integrity?: DataIntegrity
  }


  type CssSelector = {
    type: 'CssSelector',
    value: string
  }

  interface DataIntegrity {
    type: string,
    value: string
  }

  interface Header {
    show: boolean,
    navigation: boolean,
    panelsToggle: boolean,
    languageSwitch: boolean
  }

  interface Idref {
    '@context': string,
    base?: string,
    type: string,
    id: string
  }

  interface Image {
    '@context': string,
    id: string,
    manifest?: string,
    license: License
  }


  interface Item {
    '@context': string,
    textapi: string,
    id: string,
    title?: Title[],
    type: ItemType,
    n?: string,
    lang: ItemLangCode[],
    langAlt?: string[],
    content: Content[],
    description?: string,
    image?: Image,
    annotationCollection?: string,
    modules?: Module[]
  }

  type ItemType = 'section' | 'page' | 'full'
  type ItemLangCode =
    'eng'
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
    item: string,
    manifest?: string
  }

  interface License {
    id: string,
    notes?: string
  }

  interface Manifest {
    '@context': string,
    textapi: string,
    id: string,
    label: string,
    sequence: Sequence[],
    total?: number,
    actor?: Actor[],
    repository?: Repository[],
    image?: Image,
    metadata?: Metadata[],
    support?: Support[],
    license: License[],
    description?: string,
    annotationCollection?: string,
    modules?: Module[]
  }

  interface Metadata {
    key: string,
    value?: string,
    metadata?: Metadata[]
  }


  interface Module {
    editionManuscripts?: boolean,
    editionPrints?: boolean
  }

  interface MessageBoxColors {
    info: string,
    warning: string
  }

  type RangeSelector = {
    type: 'RangeSelector',
    startSelector: CssSelector,
    endSelector: CssSelector
  }

  interface Repository {
    '@context': string,
    label?: string,
    url: string,
    baseUrl: string,
    id: string
  }

  interface Sequence {
    '@context': string
    id: string,
    type: SequenceType,
    label?: string
  }

  interface Support {
    '@context': string,
    type: SupportType,
    mime: string,
    url: string,
    integrity?: DataIntegrity
  }

  type SequenceType = 'collection' | 'manifest' | 'item'
  type SupportType = 'font' | 'css'

  interface Title {
    '@context': string,
    title: string
    type: TitleType
  }

  type TitleType = 'main' | 'sub';
}

export {}
