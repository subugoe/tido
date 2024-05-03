
interface collection {
    context: ContextCollection,
    textapi: string,
    id: string,
    title: Title []
    collector: Actor [],
    description ? : string,
    sequence: SequenceObject [],
    total ? : number,
    annotationCollection ? : string,
    modules ? : Module []

}
type ContextCollection = 'https://gitlab.gwdg.de/subugoe/textapi/specs/-/raw/main/jsonld/collection.jsonld'


interface Title {
    context: string,
    title: string
    type: TitleType
}

type TitleType = 'main' | 'sub';

interface Actor {
    context: ContextActor,
    role:  string []
    name: string,
    id ? : string,
    idref ? : Idref []

}

type ContextActor = 'https://gitlab.gwdg.de/subugoe/textapi/specs/-/raw/main/jsonld/actor.jsonld'

interface SequenceObject {
    context: ContextSequence
    id: string,
    type: TypeSequenceObject,
    label: string
}

interface Module {
    editionManuscripts ? : boolean,
    editionPrints ? : boolean
}

type TypeSequenceObject = 'collection' | 'manifest' | 'item'

type ContextSequence = 'https://gitlab.gwdg.de/subugoe/textapi/specs/-/raw/main/jsonld/sequence.jsonld'
interface Idref {
    context: ContextIdref,
    base ? : string,
    type : string,
    id: string
}

type ContextIdref = 'https://gitlab.gwdg.de/subugoe/textapi/specs/-/raw/main/jsonld/idref.jsonld'

function isCollection(object: any): object is collection {
    const idValue = object.id;
    return idValue.split('/').slice(-1)[0] === 'collection.json'
}

function setRoleInActorOfTextObject(object: any) {
    // this function is to be applied on each newly created collection
    if(isCollection(object)) {
        object.collector.forEach((item) => {
            item.role = ['collector'];
          });
    }
    return object;
}