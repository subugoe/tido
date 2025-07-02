const parseStyleString = (styleString) => {
  return styleString
    .split(';')
    .filter((rule) => rule.trim() !== '')
    .reduce((styleObj, rule) => {
      const [key, value] = rule.split(':')
      if (!key || !value) return styleObj

      const camelKey = key
        .trim()
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

      styleObj[camelKey] = value.trim()
      return styleObj
    }, {})
}

export {
  parseStyleString
}
