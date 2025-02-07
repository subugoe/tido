import { build } from './form-builder.js'
import {triggerConfetti} from "./confetti.js";
/**
 * Dynamic Form Configuration Guide:
 *
 * Each field in the `formConfig` array represents an input element.
 *
 * Field properties:
 * - name: Unique field identifier
 * - type: "text", "number", "select", "checkbox", "radio", "switch" or "group"
 * - label: Field label displayed on the form
 * - options: (For select, checkbox, and radio types) List of selectable values, each with "value" and "label"
 * - repeatable: (For group types) Allows multiple instances of the field
 * - conditional: (For select types) Shows additional fields based on selection
 */

document.addEventListener("DOMContentLoaded", function () {
  const config = [
    {
      name: "collection",
      type: "text",
      label: "Collection",
      description: 'Specifies a collection endpoint URL. Will be prioritized over "manifest" key.'
    },
    {
      name: "colors",
      type: "group",
      label: "Colors",
      description: 'Sets custom theme colors. If any value is left blank (e.g. "primary": "",), a default color scheme will be used.',
      fields: [
        { name: "forceMode",
          type: "select",
          label: "Enforce Theme Mode",
          description: 'Enforces the initial color mod despite the browser settings. Supported values: `light`, `dark`, `none`',
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ],
          default: 'light'
        },
        {
          name: "primary",
          type: "color",
          label: "Primary",
          description: 'Used as main color in buttons, active states, highlights',
          default: '#477fbf'
        }
      ]
    },
    {
      name: "container",
      type: "text",
      label: "Container",
      default: '#app',
      description: 'Specifies the CSS selector where we should append the TIDO app to.'
    },
    {
      name: "header",
      type: "group",
      label: "Header",
      description: 'Controls the elements in the section above the content',
      fields: [
        { name: "show", type: "switch", label: "Show Whole Header", default: true, description: 'Toggle visibility of the whole header' },
        { name: "navigation", type: "switch", label: "Show Navigation", default: true, description: 'Toggle visibility of prev/next buttons' },
        { name: "panelsToggle", type: "switch", label: "Show Panels Toggle", default: true, description: 'Toggle visibility of panel toggle buttons' },
        { name: "languageSwitch", type: "switch", label: "Show Language Switch", default: false, description: 'Toggle visibility of language switch for supported languages' },
      ]
    },
    {
      name: "lang",
      type: "select",
      label: "Language",
      description: 'Sets the default language. Possible supported values: `en` , `de`.',
      options: [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
      ],
      default: 'en'
    },
    {
      name: "manifest",
      type: "text",
      label: "Manifest",
      description: 'Specifies a manifest endpoint URL. Will be ignored when there is a `collection` key specified.'
    },
    {
      name: "panels",
      type: "group",
      label: "Panels",
      description: 'Defines an array of panel objects. The panels will appear in the same order.',
      repeatable: true,
      addLabel: 'Add Panel',
      removeLabel: 'Remove Panel',
      fields: [
        {
          name: "label",
          type: "text",
          label: "Label",
          default: "Panel {i}",
          description: 'Sets the label which appears in the panel header. If there is only one view in the panel then the view label will be displayed instead. Translatable.'
        },
        {
          name: "width",
          type: "number",
          label: "Width",
          default: 1,
          description: 'Defines a width multiplier to a panel default width. Values between 1 and 10 are allowed. Float values allowed. Causes horizontal overflow. Ignored on mobile screens since the default width takes the whole screen width.'
        },
        {
          name: "views",
          type: "group",
          label: "Views",
          description: 'Defines an array of views inside of a panel. If there are multiple views, we display them in tabs. If there is only one view we omit the tabs and display the view directly inside the panel.',
          repeatable: true,
          addLabel: 'Add View',
          removeLabel: 'Remove View',
          fields: [
            {
              name: "id",
              type: "text",
              label: "ID",
              default: "view-{i}",
              description: 'Unique identifier for the view across the app.',
            },
            {
              name: "label",
              type: "text",
              label: "Label",
              default: "View {i}",
              description: 'Sets the label which appears in the tab header. If there is only one view then this label will be displayed as panel header label. Translatable.'
            },
            {
              name: "default",
              type: "switch",
              label: "Default",
              description: 'Specifies whether this view should be visible at the initial start of the app. If no `default` keys provided on views or all `default` keys are set to `false`, then the first view will be considered as default.',
              default: false
            },
            {
              name: "connector",
              type: "group",
              label: "Connector",
              description: 'Defines which view component and its options. Each view can have its own arbitrary config options.',
              fields: [
                { name: "id",
                  type: "select",
                  label: "Connector ID",
                  description: 'Defines the component id which will be rendered dynamically for this view. See view connectors.',
                  options: [
                    { value: "1", label: "1 - Tree" },
                    { value: "2", label: "2 - Metadata" },
                    { value: "3", label: "3 - Image" },
                    { value: "4", label: "4 - Text" },
                    { value: "5", label: "5 - Annotations" },
                    { value: "6", label: "6 - Variants" }
                  ],
                  conditional: {
                    "1": [
                      {
                        name: "options",
                        type: "group",
                        label: "Tree Options",
                        fields: [
                          { name: "item", type: "text", label: "Item" },
                          { name: "manifest", type: "text", label: "Manifest" }
                        ]
                      }
                    ],
                    "2": [
                      {
                        name: "options",
                        type: "group",
                        label: "Metadata Options",
                        fields: [
                          { name: "documentsOrder", type: "list", label: "Documents Order" },
                        ]
                      }
                    ],
                    "4": [
                      {
                        name: "options",
                        type: "group",
                        label: "Text Options",
                        fields: [
                          { name: "type", type: "text", label: "Type" },
                        ]
                      }
                    ],
                    "5": [
                      {
                        name: "options",
                        type: "group",
                        label: "Annotation Options",
                        fields: [
                          {
                            name: "types",
                            type: "group",
                            label: "Types",
                            repeatable: true,
                            description: "Specifies the name which corresponds to the x-content-type property from annotations response.",
                            fields: [
                              { name: "name", type: "text", label: "Name", default: '', description: "Specifies the name which corresponds to the x-content-type property from annotations response." },
                              { name: "icon", type: "icons", label: "Icon", description: "Specifies an icon that is displayed on the left of the annotation item. Currently we provide only a fixed list of possible icons." },
                              { name: "displayWhen", type: "text", label: "Display When", description: "Text content type that was specified under Text options. Annotation will only be shown if that content type is currently active." },
                              { name: "annotationType", type: "select", label: "AnnotationType", description: "Controls the look of the annotation item. Allowed values: annotation or text. Currently the only difference is that there is no index at type text.",
                                options: [
                                  { value: "annotation", label: "annotation" },
                                  { value: "text", label: "text" },
                                ]
                              }
                            ]
                          },
                        ]
                      }
                    ]
                  }
                },
              ]
            }
          ]
        }
      ]
    },
    {
      name: "translations",
      type: "translations",
      label: "Translations",
      description: "Defines a translation key/value pair for a supported language. You can override existing key/value pairs or define custom key/value pairs. There is a list that we expose for overriding in the configuration."
    }
  ]
  build('#app', config)
})

document.getElementById('copy').addEventListener('click', function () {
  const json = document.querySelector('.json-container > pre')
  navigator.clipboard.writeText(json.innerHTML)
  this.innerText = 'Copied 👍'
  triggerConfetti()
})
