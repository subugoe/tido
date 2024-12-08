export async function readApi(url: string) {
  const apiData = await fetch(url);
  const data = await apiData.json();

  return data;
}
