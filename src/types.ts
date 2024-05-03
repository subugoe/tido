
interface collection {
    context: ContextCollection,
    textapi: string,
    id: string,
    title: Title []
    collector: Actor,

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
    role:  string []// needs to be 'collector' in case of collections,
    name: string,
    id ? : string,
    idref ? : Idref []
    //id?: string

    // should be a method to set the role by checking 

}

type ContextActor = 'https://gitlab.gwdg.de/subugoe/textapi/specs/-/raw/main/jsonld/actor.jsonld'
type RoleActorInCollection = ['collector']

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
    if(isCollection(object)) {
        object.collector.role = ['collector'];
    }
    return object;
}