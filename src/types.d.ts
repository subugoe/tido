declare global {
    
    interface Annotation {
        body: AnnotationContent[],
        target: AnnotationTarget[],
        type: string,
        id: string
    }

    interface AnnotationView extends View {
        connector: {
            id: number,
            options: AnnotationViewOptions
       }
   }

   interface AnnotationViewOptions {
        types: AnnotationOptionsTypes[]
   }

   interface AnnotationOptionsTypes {
      name: string,
      index: string
   }

    interface ActiveAnnotation {
        [key: string]: Annotation
    }

    interface Actor {
        '@context': string,
        role:  string[],
        name: string,
        id?: string,
        idref?: Idref[]

    }

    interface AnnotationContent {
      type: 'TextualBody',
      value: string,
      format: AnnotationContentFormat,
      'x-content-type': AnnotationContentType
    }

    type AnnotationContentFormat = 'text/plain' | 'text/html'
    type AnnotationContentType = 'Person' | 'Place'

    interface AnnotationTarget {
        selector: CssSelector | RangeSelector,
        format: string,
        language: string,
        source: string
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

    interface Config {
        container: string,
        collection: string,
        manifest: string,
        item: string,
        panels: TidoPanels,
        colors: Colors,
        header: Header,
        labels: Labels,
        lang: string,
        meta: MetaConfig,
        notificationColors: NotificationColors
    }

    interface Content {
        '@context': string,
        url: string,
        type: string,
        integrity?: DataIntegrity
    }

    interface ContentView extends View {
        connector: {
            id: number,
            options: {
              labels: Labels
            }
          }
    }

    type ContentsAndMetadataViews = [
        ContentView,
        MetadataView
    ]


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

    interface ImageView extends View {
        connector: {
          id: number
        }
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
    type ItemLangCode = 'eng' | 'fra' | 'deu' | 'ara' | 'arb' | 'arz' | 'apc' | 'acm' | 'zho' | 'cmn' | 'yue' | 'nan' | 'tha' | 'sou' | 'nod' | 'khb' | 'lao/tts' | 'pht'

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

    interface MetadataView extends View {
        connector: {
            id: number,
            options: MetadataViewConfigOptions
        }
    }
    interface MetadataViewConfigOptions {
        collection: {
            all: boolean
        },
        manifest: {
            all: boolean
        },
        item: {
            all: boolean
        }
    }

    interface Module {
        editionManuscripts?: boolean,
        editionPrints?: boolean
    }

    interface NotificationColors {
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


    interface TextView extends View {
        connector: {
            id: number
        }
    }


    type TidoPanels = [ 
        ContentPanel,
        MetadataPanel,
        ImagePanel,
        TextPanel,
        AnnotationPanel
    ]
    
    interface Title {
        '@context': string,
        title: string
        type: TitleType
    }
    type TitleType = 'main' | 'sub';

    interface View {
        id: string,
        label: string,
        default?: boolean
    }

    interface Panel {
        label: string,
        show: boolean,
        toggle: boolean
    }

    interface ContentPanel extends Panel {
        views: ContentView[] 
    }

    interface MetadataPanel extends Panel {
        views: MetadataView[]
    }

    interface ImagePanel extends Panel {
        views: ImageView[]
    }

    interface TextPanel extends Panel {
        views: TextView[]
    }

    interface AnnotationPanel extends Panel {
        views: AnnotationView[]
    }
}

export {}