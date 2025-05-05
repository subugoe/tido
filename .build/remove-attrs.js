function removeAttrs(attributes = []) {
  return {
    name: 'remove-attributes',
    enforce: 'post',
    transform(code, id) {
      if (id.endsWith('.js') || id.endsWith('.tsx') || id.endsWith('.jsx')) {
        const regex = new RegExp(`\(${attributes.join('|')})`, 'g');
        return code.replace(regex, '');
      }
      return code;
    },
  }
}

export {
  removeAttrs
}
