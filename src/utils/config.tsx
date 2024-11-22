export function getUrls(panels) {
  let list: string[] = [];
  if (!panels || panels.length === 0) console.error("No panels are configured");
  panels.forEach((panel) => {
    if ("collection" in panel && panel["collection"] !== "")
      list.push(panel["collection"]);
    if ("manifest" in panel && panel["manifest"] !== "")
      list.push(panel["manifest"]);
  });
  return list;
}
