declare global {
    
    interface Actor {
        '@context': string,
        role:  string[]
        name: string,
        id? : string,
        idref? : Idref[]

    }

    interface Collection {
        '@context': string,
        textapi: string,
        id: string,
        title: Title[]
        collector: Actor[],
        description? : string,
        sequence: SequenceObject[],
        total? : number,
        annotationCollection? : string,
        modules? : Module[]
    
    }

    interface Idref {
        '@context': string,
        base? : string,
        type : string,
        id: string
    }

    interface Module {
        editionManuscripts? : boolean,
        editionPrints? : boolean
    }

    interface SequenceObject {
        '@context': string
        id: string,
        type: TypeSequenceObject,
        label: string
    }
    type TypeSequenceObject = 'collection' | 'manifest' | 'item'

    interface Title {
        '@context': string,
        title: string
        type: TitleType
    }
    type TitleType = 'main' | 'sub';

}

export {}
