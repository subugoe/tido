export default {
  methods: {
    getElementById(id) {
      if (!id) {
        return null;
      }

      return document.getElementById(id.replace(/#/g, ''));
    },

    highlightActiveTabContent(contentTypes) {
      this.annotations.forEach((annotation) => {
        const id = this.stripAnnotationId(annotation.target.id);
        const textElement = this.getElementById(id);

        if (textElement) {
          const next = textElement.getAttribute('data-next');
          const hasContentType = contentTypes.includes(annotation.body['x-content-type']);

          if (hasContentType) {
            this.updateTextContentClass(textElement, 'add', 'annotation', 'annotation-disabled');
          } else {
            this.updateTextContentClass(textElement, 'remove', 'annotation');
            this.updateTextContentClass(textElement, 'add', 'annotation-disabled');
          }

          if (next) {
            this.highlightNestedMotifs(next, hasContentType ? 'add' : 'remove', 'add');
          }
        }
      });
    },

    highlightNestedMotifs(id, annotationOperation, annotationDisabledOperation) {
      const element = this.getElementById(id);

      if (!element) {
        return;
      }

      this.updateTextContentClass(element, annotationOperation, 'annotation');
      this.updateTextContentClass(element, annotationDisabledOperation, 'annotation-disabled');

      const nextId = element.getAttribute('data-next');

      if (!nextId) {
        return;
      }

      this.highlightNestedMotifs(nextId, annotationOperation, annotationDisabledOperation);
    },

    sortAnnotation(annotations) {
      if (!annotations?.length) {
        return [];
      }

      const output = annotations.map((annotation) => ({
        ...annotation,
        annotationIdValue: this.stripId(annotation.strippedId).split('.').filter((x) => x),
      })).sort((a, b) => b.annotationIdValue.length - a.annotationIdValue.length);

      const annotationIdLength = output[0]?.annotationIdValue?.length || 0;

      return output.map((x) => {
        //  Consider this as IP address (annotation ID)
        //  We will get longest ip address we have ("max" here)
        //  And if any of ip address part less then max then we are append 1 to it
        //  e.g Max = [1.2.3.4]
        //  current = [1.2.3] // Less than max because max has four parts
        //  So annotationIdValue current will be [1.2.3.1] --> Last 1 is better for comparision.
        const annotationId = annotationIdLength - x.annotationIdValue.length;

        if (annotationId > 0) {
          x.annotationIdValue = [...x.annotationIdValue, ...new Array(annotationId).fill(1)].join('');
        } else {
          x.annotationIdValue = x.annotationIdValue.join('');
        }

        return x;
      }).sort((a, b) => a.annotationIdValue - b.annotationIdValue);
    },

    /**
    * get the annotation id of the current item
    *
    * @param string url
    * @return string
    */

    stripAnnotationId(url) {
      return url.split('/').pop();
    },

    stripId(val) {
      return val.replace(/-/g, '.').replace(/[^.0-9]/g, '');
    },

    updateNestedMotifToggle(id, annotationClassOperation) {
      const element = this.getElementById(id);

      if (!element) {
        return;
      }

      this.updateTextContentClass(element, annotationClassOperation, 'annotation-disabled');

      const nextId = element.getAttribute('data-next');

      if (!nextId) {
        return;
      }

      this.updateNestedMotifToggle(nextId, annotationClassOperation);
    },

    updateToggleState(annotation, text = 'toggle', list = 'toggle') {
      const id = this.stripAnnotationId(annotation.target.id);

      this.updateTextContentClass(this.getElementById(id), text, 'annotation-disabled');
      this.updateTextContentClass(this.getElementById(`list${id}`), list, 'bg-grey-2');

      this.updateNestedMotifToggle(this.getElementById(id).getAttribute('data-next'), text);
    },

    updateTextContentClass(element, task = 'add', ...className) {
      element.classList[task](...className);
    },
  },
};
