export default {
  computed: {
    tidoConfig() {
      return JSON.parse(document.getElementById('tido-config').text);
    },
  },
  methods: {
    getAllElementsFromSelector(selector, arr = []) {
      const el = document.getElementById(selector);
      if (el) {
        // https://www.geeksforgeeks.org/queue-data-structure/
        const queue = [];

        queue.push(el);

        while (queue.length) {
          const popped = queue.pop();
          arr.push(popped);
          [...popped.children].forEach((child) => {
            queue.push(child);
          });
        }
        return arr;
      }

      return [...document.querySelectorAll(`.${selector}`)];
    },
    getElementById(id) {
      if (!id) {
        return null;
      }

      return document.getElementById(id.replace(/#/g, ''));
    },

    getNewLevel(element, operation) {
      const currentLevel = parseInt(
        element.getAttribute('data-annotation-level'),
        10,
      );
      if (operation === 'INC') {
        return currentLevel + 1;
      }
      if (currentLevel !== 0) {
        return currentLevel - 1;
      }
      return currentLevel;
    },

    addHighlightToTargetIds(selector, root) {
      const element = root.getElementById(selector);
      if (!element) {
        return;
      }

      function recursiveAddClass(children) {
        [...children].forEach((child) => {
          child.setAttribute('data-annotation', true);
          child.classList.add(selector);
          recursiveAddClass(child.children);
        });
      }

      if (!element.children.length) {
        element.setAttribute('data-annotation', true);
        element.classList.add(selector);
      }

      recursiveAddClass(element.children);
    },

    highlightActiveContent(annotations) {
      annotations.forEach((el) => {
        if (el.target.id) {
          this.highlightActiveId(this.getElementById(this.stripTargetId(el, false)));
        } else {
          [...document.querySelectorAll(`.${this.stripTargetId(el)}`)].map((x) => x.setAttribute('data-annotation-level', 0));
        }
      });
    },

    highlightActiveId(element) {
      if (!element) {
        return;
      }
      element.setAttribute('data-annotation-level', 0);

      [...element.children].forEach((child) => {
        child.setAttribute('data-annotation-level', 0);
        this.highlightActiveId(child);
      });
    },

    replaceSelectorWithSpan(selector, root) {
      const start = root.querySelector(`[data-target="${selector}_start"]`);
      const end = root.querySelector(`[data-target="${selector}_end"]`);

      let started = false;
      let ended = false;

      function replaceRecursive(element) {
        if (!element.childNodes) return;

        [...element.childNodes].forEach((childNode) => {
          if (childNode === start) started = true;
          if (childNode === end) ended = true;

          if (ended) return;

          if (childNode.nodeName === 'SPAN' && childNode.getAttribute('data-annotation') && started) {
            childNode.classList.add(selector);
          }

          if (childNode.nodeName === '#text') {
            if (started) {
              if (childNode.textContent && childNode.textContent.trim()) {
                const span = document.createElement('span');

                span.setAttribute('class', selector);
                span.setAttribute('data-annotation', true);
                span.innerHTML = childNode.textContent;
                childNode.replaceWith(span);
              }
            }
          } else {
            replaceRecursive(childNode);
          }
        });
      }
      replaceRecursive(root);
      return root;
    },

    /**
     * get the annotation id of the current item
     *
     * @param string url
     * @return string
     */

    stripAnnotationId(url) {
      if (!url) {
        return '';
      }
      return url.split('/').pop();
    },

    stripId(val) {
      if (!val) {
        return '';
      }
      return val.replace(/-/g, '.').replace(/[^.0-9]/g, '');
    },

    stripSelector(annotation) {
      return `.${annotation.target.selector.startSelector.value
        .replace("span[data-target='", '')
        .replace("'", '')
        .replace('_start]', '')
        .replace('_end]', '')}`;
    },

    stripTargetId(annotation, removeDot = true) {
      let output = '';
      if (annotation.target.selector) {
        output = this.stripSelector(annotation);
      } else {
        output = this.stripAnnotationId(annotation.target.id);
      }

      return removeDot ? output.replace(/\./g, '') : output;
    },

    toggleAnnotationSelector(annotation, text = 'toggle') {
      const id = annotation.target.selector.startSelector.value
        .replace("span[data-target='", '')
        .replace("_start']", '');

      const isOverlap = id.includes('Overlap');
      [...document.querySelectorAll(`.${id}`)].forEach((el) => this.updateTextContentClass(
        el,
        text,
        isOverlap ? 'annotation-disabled-overlap' : 'annotation-disabled',
      ));
    },

    updateHighlightState(selector, operation, level) {
      this.getAllElementsFromSelector(selector).forEach((el) => el.setAttribute(
        'data-annotation-level',
        level || this.getNewLevel(el, operation),
      ));
    },

    updateTextContentClass(element, task = 'add', ...className) {
      if (!element) {
        return;
      }
      element.classList[task](...className);
    },
  },
};
