export default {
  methods: {
    getAllElementsFromSelector(selector, arr = []) {
      const el = document.getElementById(selector);
      if (el) {
        arr.push(el);

        [...el.children].forEach((child) => {
          arr.push(child);
        });
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
      const start = root.querySelector(`span[data-target="${selector}_start"]`);
      const end = root.querySelector(`span[data-target="${selector}_end"]`);

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

    sortAnnotation(annotations) {
      if (!annotations?.length) {
        return [];
      }

      const output = annotations
        .map((annotation) => ({
          ...annotation,
          annotationIdValue: this.stripId(this.stripTargetId(annotation, false)).split('.').filter((x) => x),
        }))
        .sort(
          (a, b) => b.annotationIdValue.length - a.annotationIdValue.length,
        );

      const annotationIdLength = output[0]?.annotationIdValue?.length || 0;

      return output
        .map((x) => {
          //  Consider this as IP address (annotation ID)
          //  We will get longest ip address we have ("max" here)
          //  And if any of ip address part less then max then we are append 1 to it
          //  e.g Max = [1.2.3.4]
          //  current = [1.2.3] // Less than max because max has four parts
          //  So annotationIdValue current will be [1.2.3.1] --> Last 1 is better for comparision.
          const annotationId = annotationIdLength - x.annotationIdValue.length;

          if (annotationId > 0) {
            x.annotationIdValue = [
              ...x.annotationIdValue,
              ...new Array(annotationId).fill(1),
            ].join('');
          } else {
            x.annotationIdValue = x.annotationIdValue.join('');
          }

          return x;
        })
        .sort((a, b) => a.annotationIdValue - b.annotationIdValue);
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
        .replace("_start']", '')
        .replace("_end']", '')}`;
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
