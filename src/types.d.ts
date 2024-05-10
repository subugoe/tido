declare global {
    
    interface Actor {
        '@context': string,
        role:  string[]
        name: string,
        id?: string,
        idref?: Idref[]

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

    interface DataIntegrity {
        type: string,
        value: string
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
