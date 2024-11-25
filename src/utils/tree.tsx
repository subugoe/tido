export async function getDocumentNode(
  url: string,
  documentType: string,
  key: number
) {
  let node = {};
  const apiData = await fetch(url);
  const data = await apiData.json();
  //const currKey = key + 1;
  node["key"] = key.toString();
  node["children"] = await getChildrenNodes(node["key"], data.sequence);
  node["label"] = getTitle(data, documentType);
  return node;
}

async function getChildrenNodes(parentKey: string, items) {
  let nodes = [];
  if (!items || items.length === 0) return [];
  for (let i = 0; i < items.length; i++) {
    let node = {};
    node["key"] = parentKey + "-" + i.toString();
    node["label"] = items[i].label;
    const apiData = await fetch(items[i].id);
    const data = await apiData.json();
    node["children"] = await getChildrenNodes(node["key"], data.sequence);
    nodes.push(node);
  }
  // each node should have children - which will be items
  return nodes;
}

function getTitle(data, documentType: string): string {
  if (documentType === "collection") return data.title[0].title;
  else if (documentType === "manifest") return data.label;
}
