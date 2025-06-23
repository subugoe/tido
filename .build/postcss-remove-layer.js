function postcssRemoveLayer(layer) {
  return {
    postcssPlugin: 'remove-layer',
    Once(root) {
      root.walkAtRules('layer', (atRule) => {
        if (atRule.nodes && atRule.params.trim() === layer) {
          // Move all children of the layer to the parent
          atRule.replaceWith(...atRule.nodes);
        }
      });
    }
  }
}

export { postcssRemoveLayer }
