import * as DomUtils from './dom.js'
function discoverParentAnnotationIds(el, annotationIds = {}) {
  const parent = el.parentElement;
  if (parent && parent.id !== 'text-content') {
    DomUtils.getValuesFromAttribute(parent, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
    return discoverParentAnnotationIds(parent, annotationIds);
  }
  return annotationIds;
}

function discoverChildAnnotationIds(el, annotationIds = {}) {
  const {children} = el;

  [...children].forEach((child) => {
    if (child.dataset.annotation) {
      DomUtils.getValuesFromAttribute(child, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
      annotationIds = discoverChildAnnotationIds(child, annotationIds);
    }
  });
  return annotationIds;
}


export {
  discoverParentAnnotationIds,
  discoverChildAnnotationIds
}
