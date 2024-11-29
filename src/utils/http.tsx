export async function readApi(url) {
  const apiData = await fetch(url);
  const data = await apiData.json();

  return data;
}
