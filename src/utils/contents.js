/**
 * get the collection label, if provided; otherwise get the manifest label
 * caller: *getCollection()*, *getManifest()*
 *
 * @param object data
 *
 * @return string 'label'
 */
export function getLabel(collection) {
  if (Object.keys(collection).length) {
    return collection.title && collection.title[0].title
      ? collection.title[0].title
      : collection.label;
  }

  return collection.label
    ? collection.label
    : 'Manifest <small>(No label available)</small>';
}
