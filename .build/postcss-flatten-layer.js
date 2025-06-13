export default function flattenLayer() {
  return {
    postcssPlugin: 'postcss-flatten-layer',
    AtRule: {
      layer(atRule) {
        if (atRule.nodes) {
          atRule.replaceWith(...atRule.nodes);
        } else {
          atRule.remove();
        }
      }
    }
  };
}

flattenLayer.postcss = true;
