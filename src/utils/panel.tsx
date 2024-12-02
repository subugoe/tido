// get the url of the document (collection or manifest) which will be shown in the panel
export function getPanelUrl(panel) {
  if (!('collection' in panel) && !('manifest' in panel))
    console.error('manifest or collection not defined in panel');
  if ('collection' in panel) return panel.collection;
  if ('manifest' in panel) return panel.manifest;
}
