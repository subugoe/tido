export function getUrls(documents) {
    let list: string[] = [];
    if (!documents) console.error('No initial documents are configured');
    Object.keys(documents).forEach((key) => {
        const urls = documents[key];
        list = [...list, ...urls];
    });
    return list;
}
