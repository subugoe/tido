const parseStyleString = (styleString: string): Record<string, string> => {
  return styleString
    .split(';')
    .filter((rule: string) => rule.trim() !== '')
    .reduce((styleObj: Record<string, string>, rule: string) => {
      const [key, value] = rule.split(':')
      if (!key || !value) return styleObj

      const camelKey = key
        .trim()
        .replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase())

      styleObj[camelKey] = value.trim()
      return styleObj
    }, {})
}

export {
  parseStyleString
}
