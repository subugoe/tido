export default {
  methods: {
    findDomElement(selector, dom = document) {
      const element = dom.querySelector(selector);
      if (!element) {
        return null;
      }

      return element;
    },

    findDomElementById(id, dom = document) {
      const element = dom.getElementById(id);
      if (!element) {
        return null;
      }

      return element;
    },

    findDomElements(selector, dom = document) {
      return [...dom.querySelectorAll(selector)];
    },

    mapUniqueElements(elements, mapFn) {
      return [...new Set(elements.map(mapFn))];
    },

    mapElements(elements, mapFn) {
      return [...elements.map(mapFn)];
    },

    manipulateDomElements(elements, mapFn) {
      return [...elements.map(mapFn)];
    },
  },
};
