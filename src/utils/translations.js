

export function isAhiqarWebsite(config) {
    if (config.collection === '') return false
    return config.collection.includes('ahiqar') === true
}
