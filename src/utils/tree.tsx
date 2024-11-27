let nestingLevel = 0;

export async function getDocumentNode(
  url: string,
  documentType: string,
  key: number
) {
  nestingLevel = 0;
  console.log("get Document node with key", key);
  let node = {};
  const apiData = await fetch(url);
  const data = await apiData.json();
  //const currKey = key + 1;
  node["key"] = key.toString();
  node["label"] = getTitle(data, documentType);
  console.log("creating document node of", documentType);
  node["children"] = await getChildrenNodes(node, data.sequence);
  //console.log("document node", node);
  return node;
}

async function getChildrenNodes(parentNode, items) {
  nestingLevel += 1;
  // items: 'currentItems'
  if (!items || items.length === 0) return [];
  parentNode["children"] = [];
  for (let i = 0; i < items.length; i++) {
    let node = {};
    node["key"] = parentNode.key + "-" + i.toString();
    node["label"] = items[i].label;
    if (nestingLevel < 2) {
      const apiData = await fetch(items[i].id);
      const data = await apiData.json();
      node["children"] = await getChildrenNodes(node, data.sequence);
    }
    parentNode["children"].push(node);
  }
  return parentNode["children"];
}

function getTitle(data, documentType: string): string {
  if (documentType === "collection") return data.title[0].title;
  else if (documentType === "manifest") return data.label;
}
