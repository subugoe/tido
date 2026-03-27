 # TIDO

Text vIewer for Digital Objects. A highly configurable client for the [TextAPI](https://subugoe.pages.gwdg.de/emo/text-api/) to display texts, annotations and images.

## Demo

Please visit our [demo page](https://subugoe.github.io/tido/) where you can run TIDO with your own TextAPI endpoint
and also view our production examples.


## Overview

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting Started](#getting-started)
  - [Get the Viewer](#get-the-viewer)
    - [Installation](#installation)
  - [Integration](#integration)
    - [Embedded Bundle](#embedded-bundle)
    - [React](#react)
- [Configuration](#configuration)
  - [The Keys in Detail](#the-keys-in-detail)
  - [Panel Views](#panel-views)
  - [Annotations](#annotations)
    - [Types](#types)
    - [Filters](#filters)
    - [AnnotationsMode](#annotationsmode)
  - [Translations](#translations)
    - [Collection Namespaces](#collection-namespaces)
- [Bookmarking](#bookmarking)
  - [How it works](#how-it-works)
  - [Working with the state object](#working-with-the-state-object)
  - [Encoding/Decoding](#encodingdecoding)
- [Text Sanitization](#text-sanitization)
  - [Forbidden Tags](#forbidden-tags)
  - [Allowed Attributes](#allowed-attributes)
- [Getting Started (Developers)](#getting-started-developers)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
    - [Set up `nvm` and the recent stable version of `node.js`](#set-up-nvm-and-the-recent-stable-version-of-nodejs)
    - [Clone the Repository](#clone-the-repository)
    - [Get the Dependencies](#get-the-dependencies)
  - [Build](#build)
  - [Local Development](#local-development)
    - [Serve Development Build](#serve-development-build)
    - [Preview Production Build with examples](#preview-production-build-with-examples)
    - [Start Mock API](#start-mock-api)
  - [Testing](#testing)
    - [Quick Test Run](#quick-test-run)
    - [Testing In Detail](#testing-in-detail)
  - [Linting](#linting)
  - [Generate TextAPI support table](#generate-textapi-support-table)
- [TextAPI Support](#textapi-support)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Getting Started

TIDO is provided as **npm package**. Please follow the steps below to include it for production:

### Get the Viewer

#### Installation

```bash
npm i tido@next
```

### Integration
You can use the app in different scenarios, either as embedded bundle or as a React library.

#### Embedded Bundle

1. Add these two files to your application: `tido.min.js` and `tido.min.css`.

HTML:

```html
<link href="/node_modules/tido/dist/tido.min.css" rel="stylesheet">
<script src="/node_modules/tido/dist/tido.min.js"></script>
```

or JS:

```js
import 'tido/dist/tido.min.js'
import 'tido/dist/tido.min.css'
```

2. Add a container element to your application where TIDO can mount onto.
Please make sure that this element has your desired dimensions and position.

```html
<style>
  #app {
    height: 100vh;
    width: 100%;
  }
</style>

<div id="app"></div>
```

3. Create a new TIDO instance and provide optionally your TIDO configuration:

```html
<script>
  const tido = new Tido({
    rootCollections: ['https://example.com/textapi/collection.json']
  });
</script>
```

#### React
Use TIDO directly inside your React application (e.g., SPA or Next.js) as a component:

```jsx
import { Tido } from 'tido'
import 'tido/dist/tido.min.css'

export default function TidoPage() {

  return <div className="container">
    <Tido config={} />
  </div>
}
```

Below you can find a detailed explanation of the configuration object.

## Configuration

You can fully customize the viewer's behaviour by providing a configuration object to the TIDO instance.
First of all, there should be set either a `collection` or a `manifest` value.

By default, TIDO will render 5 panels displaying sequence tree, metadata, image, text content and annotation views.

There are options to

- add/remove multiple panels
- freely combine view components in panels
- show/hide header features
- change the color scheme
- and more ...

**Example configuration:**

<details>
<summary>Click to open</summary>

```html
<script id="tido-config" type="application/json">
  {
    "allowNewCollections": false,
    "defaultPanelMode": "split",
    "lang": "de",
    "panels": [
      {
        "collection": "https://api.ahiqar.uni-goettingen.de/textapi/ahiqar/syriac/collection.json",
        "manifest": "https://api.ahiqar.sub.uni-goettingen.de/textapi/ahiqar/syriac/3r145/manifest.json"
      }
    ],
    "theme": {
      "primaryColor": "#1E40AF"
    },
    "rootCollections": [
      "https://textapi.dev.vierwachen.sub.uni-goettingen.de/api/4w/collection.json"
    ],
    "translations": {
      "de": {
        "accurate": "Handschriftengetreu",
        "simplified": "Vereinfacht"
      }
    },
    "title": "Vier Wachen Edition"
  }
</script>
```
</details>

### The Keys in Detail

| Name                                             | Type                             | Default                                                                            | Description                                                                                                                                                                                                                             |
|--------------------------------------------------|----------------------------------|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| allowNewCollections                              | Boolean                          | true                                                                               | Toggles the ability to add new collections to the app through a user input.                                                                                                                                                             |
| annotations                                      | AnnotationsConfig                | {}                                                                                 | Configures the display of annotations and their filtering options. See [annotations](#annotations) chapter.                                                                                                                             |
| annotations.defaultMode                          | String                           | `aligned`                                                                          | An annotations mode toggle is shown. Initial selected mode is `aligned` mode                                                                                                                                                            |
| annotations.filters                              | AnnotationFiltersConfig          | -                                                                                  | Defines a nested object of filter options.                                                                                                                                                                                              |
| annotations.singleMode                           | String                           | -                                                                                  | Specifies only one annotations mode, which can be either `aligned` or `list`                                                                                                                                                            |
| annotations.types                                | AnnotationTypeConfigMap          | -                                                                                  | A map of config objects for annotation types. This is used to display custom labels and icons in annotation items.                                                                                                                      |
| annotations.types[i].label                       | String                           | -                                                                                  | Custom label to display for an annotation type.                                                                                                                                                                                         |
| container                                        | String                           | `#app`                                                                             | Specifies the CSS selector where we should append the TIDO app to.                                                                                                                                                                      |
| lang                                             | String (ISO 639-1 language code) | `en`                                                                               | Specifies the current active language of the app. See [translations](#translations) chapter.                                                                                                                                            |
| panelModes                                       | Array                            | ['swap', 'split', 'text', 'image']                                                 | Controls the display and order of panel mode toggles in the top right of a panel. At least 1 value is required. If not specified at all, TIDO will use the default value and try to display reasonable toggles and disable unused ones. |
| panels                                           | PanelConfig[]                    | []                                                                                 | Defines an array of panel objects. The panels will appear in the same order.                                                                                                                                                            |
| panels[i].collection                             | String                           | -                                                                                  | TextAPI collection URL.                                                                                                                                                                                                                 |
| panels[i].item                                   | String                           | -                                                                                  | TextAPI item URL. If not specified, the first item of the collection will be used.                                                                                                                                                      |
| panels[i].manifest                               | String                           | -                                                                                  | TextAPI manifest URL. If not specified, the first manifest of the collection will be used.                                                                                                                                              |                                                                                                                                                                                                                            |
| panels[i].selectedAnnotation                     | String                           | -                                                                                  | Specifies the ID of a specific annotation to select/display when the panel loads.                                                                                                                                                       |
| panels[i].showSidebar                            | Boolean                          | -                                                                                  | Controls whether the annotations sidebar is visible for this panel.                                                                                                                                                                     |
| panels[i].views                                  | PanelViewConfig[]                | -                                                                                  | Overrides the global `panelViews` config for this specific panel. Use this to customize views per panel while still inheriting unset properties from the global config.                                                                 |
| panelViews                                       | PanelViewConfig[]                | `[{label: "Image", view: "image"}, {label: "Text", view: "text"}]`                 | Configures an initial distribution of content views inside each panel. The defined views here can then be toggled on/off in the "View" dropdown in the panel header. See [Panel Views](#panel-views) chapter.                           |
| panelViews[i].activeContentType                  | String                           | -                                                                                  | Specifies which content type should be active/selected by default for this view. Use with contentTypes to set the default selection.                                                                                                    |
| panelViews[i].contentTypes                       | String[]                         | -                                                                                  | Specifies a list of TextAPI content type identifiers. If multiple are given, a content type toggle with a dropdown selection will be shown. Users can then switch the respective content type within a split pane.                      |
| panelViews[i].label                              | String                           | `Image` \| `Text`                                                                  | Specifies a label for a view. It appears as title prefix in the content type toggle and in the "View" selection dropdown in the panel header.                                                                                           |
| panelViews[i].view                               | `image` \| `text`                | `image` \| `text`                                                                  | Specifies a view identifier that should be loaded into a split pane.                                                                                                                                                                    |
| panelViews[i].visible                            | Boolean                          | true                                                                               | Controls whether this view is visible in the panel. When false, the view will be hidden but can be toggled on via the "View" dropdown.                                                                                                  |
| rootCollections                                  | String[]                         | []                                                                                 | Specifies a list of TextAPI collection URLs that appear in the global tree on the left. Users navigate and open new panels from those collections.                                                                                      |
| showAddNewPanelButton                            | Boolean                          | true                                                                               | Toggles the display of the "add new panel" button.                                                                                                                                                                                      |
| showContentTypeToggle                            | Boolean                          | true                                                                               | Toggles the display of the content type toggle in TextViews. When false, the whole bar is hidden.                                                                                                                                       |
| showGlobalTree                                   | Boolean                          | true                                                                               | Toggles the display of the global tree on the left. When false the toggle button in the header is hidden.                                                                                                                               |
| theme                                            | Object                           | Object                                                                             | Specifies theme settings for UI elements.                                                                                                                                                                                               |
| theme.primaryColor                               | String                           | `#3456aa`, `rgb(79, 70, 229)`, `hsl(243, 75%, 59%)`, `oklch(0.4743 0.1405 264.94)` | Primary color of UI elements. Used on buttons and other interactive elements. The value can be provided as string in following color systems (hex, rgb, hsl, oklch). Alpha channel is not supported.                                    |
| title                                            | String                           | empty                                                                              | Specifies the main title of the app in the header. Translatable.                                                                                                                                                                        |
| translations                                     | Object                           | null                                                                               | Specifies a custom translations object. See [translations](#translations) chapter.                                                                                                                                                      |
| translations.[lang]                              | TranslationNamespace             | -                                                                                  | Defines a language key. The value is a TranslationNamespace object.                                                                                                                                                                     |
| translations.[lang].[namespace]                  | Object                           | -                                                                                  | Defines a translation key/value pair for a supported language. You can override existing key/value pairs or define custom key/value pairs. There is a [list](#translations) that we expose for overriding in the configuration.         |
| translations.[lang].[namespace].[translationKey] | String                           | -                                                                                  | Defines a translation key/value pair for a supported language. You can override existing key/value pairs or define custom key/value pairs. There is a [list](#translations) that we expose for overriding in the configuration.         |

### Panel Views
This array of `PanelViewConfig` objects defines the actual visible content inside a panel. It is a list of
objects, each of which creates a resizable split pane inside the panel. This configuration will be applied to all
additionally added panels. Users can toggle on/off each split pane by the "View" dropdown in the panel header.
It will show your configured labels of each `PanelViewConfig` as options. If no label is stated, it will show the raw
content type identifier instead.

### Annotations
We provide configuration options to customize both the display and filtering of annotations.

The configuration is organized by concern. Each aspect can be defined independently using its own configuration object
under a dedicated key.

Working with annotations, especially variants, can be complex.
Variant annotations reference one or more witnesses, which are identified by string identifiers.
Within the configuration, these witness identifiers are treated as annotation types.
This allows you to apply the same configuration principles to witnesses as you would to any other annotation type.

If no annotations configuration is provided at all, TIDO will discover the currently available annotations on-the-fly.
The visible types and filters are highly dependent on the loaded  panel content.

#### Types

| Key   | Type                    |
|-------|-------------------------|
| types | AnnotationTypeConfigMap |

A map of config objects for annotation types. Each key represents the annotation type string ("x-content-type").
Each value is an `AnnotationTypeConfig` object for setting a custom label and icon.
These values will be used in the UI to customize the display of annotations items in the panel sidebar.

As mentioned above, variant annotations are a special case. In order to configure the witnesses display,
you can set a the `idno` value from the `refs`-Array in the annotationsPage response.

**Example:**

```json
{
  "annotations": {
    "types": {
      "Place": { "label": "Ort" },
      "witness_a": { "label": "Witness A" }
    }
  }
}
```

#### Filters

| Key     | Type                    |
|---------|-------------------------|
| filters | AnnotationFiltersConfig |

Annotations displayed in the sidebar can be filtered by their type. You can define a hierarchical structure for these
filter options, referred to as a filter tree.
Each node in the filter tree can control multiple annotation types simultaneously. Therefore, you need to
specify an array of annotation types that should be affected by a given filter node.

At the root level, you can optionally define a `rootSelectionRule` (allowed values: `multiple` or `single`) to control
the overall behavior and layout of the filter UI:

If set to `single`, the UI renders a tab bar containing the root-level nodes and a content area below it.
Selecting a tab updates the content area to display the child nodes of the selected root option.

If set to `multiple`, a multi-selection tree is rendered without a tab bar,
allowing multiple root-level nodes to be selected simultaneously.

If the rule is not specified, we set it to `multiple`.

Please note that TIDO does not currently validate `selected` states.
If you use the `selected` property on filter tree nodes, ensure that the configured default states are logically consistent.

**Example:**

```json
{
  "annotations": {
    "filters": {
      "rootSelectionRule": "single",
      "items": [
        {
          "label": "Variants",
          "types": ["Variant"],
          "items": [
            {
              "label": "Witness A",
              "types": ["witness_a"]
            },
            {
              "label": "Witness B",
              "types": ["witness_b"]
            }
          ]
        },
        {
          "label": "Commentary",
          "items": [
            {
              "label": "Entities",
              "items": [
                {
                  "label": "Places",
                  "types": ["place", "region"]
                },
                {
                  "label": "Persons",
                  "types": ["person"]
                }
              ]
            },
            {
              "label": "Additions",
              "types": ["addition"]
            }
          ]
        },
        {
          "label": "Dictionary",
          "types": ["dict"]
        }
      ]
    }
  }
}

```

#### AnnotationsMode

By default we provide an AnnotationsMode toggle which enables switching between `list` and `aligned` mode. Aligned mode
will arrange annotations at the top position of text targets. List mode will ignore positioning and arrange the annotations
vertically one after another.
To specify the initial selected mode you should add `defaultMode` in `annotations` config as following.

**Example:**

```json
{
  "annotations": {
    "defaultMode": "list"
  }
}
```

You can also have only one mode of annotations. In this case AnnotationsToggle is not shown anymore.
To accomplish this, you should add `singleMode` key in config as shown below.

**Example:**

```json
{
  "annotations": {
    "singleMode": "aligned"
  }
}
```

If no key regarding modes is specified, then by default AnnotationsToggle is shown with `aligned` mode as initially selected.


### Translations
We provide a flexible way to use TIDO in your desired language. First of all we keep all translation keys in files
under `public/translations`. Each file has to follow the naming convention `[ISO 639-1 language code].json`. By default,
we provide a limited amount of supported languages. However, you can configure your custom languages though the TIDO config object.
Append your language under the `translations` key in the config and set the `lang` key to your language, so it is treated
as active language.

#### Collection Namespaces
In TIDO we give you the ability to define custom translations for different collections.

**This is how it works:**
The translation key/value pairs are always wrapped by a namespace which can be either `common` or a collection slug.
The default namespace is `common` and is used as a fallback namespace.
You have to provide at least one namespace in your translation objects. If you don't need to use collection namespaces it still has to be `common`.
If the namespace is a TextAPI collection slug,
we check at initialization time of each panel whether there is a match between the namespace key and the slug from the loaded collection.
You don't need to provide a full set of translation key/value pairs on each namespace.
As mentioned before, `common` is a fallback namespace, so if any translation key is missing on your collection namespace, it will still be translated from the `common`namespace.

Hint: There is a difference between fixed keys that we use internally (like `add_new_panel`) or dynamic keys that we might
receive from the TextAPI (like dynamic metadata keys). If you want to translate the latter ones, just state them as keys to your translation object.

**Example:**

```json
{
  "lang": "fr",
  "translations": {
    "fr": {
      "common": {
        "add_new_panel": "Ajouter un nouveau panneau",
        "title": "Titre",
        "my_custom_key": "Valeur très importante",
        "That one string": "Ce texte",
        "manifest": "manuscrit"
      },
      "special_collection": {
        "manifest": "livre"
      }
    }
  }
}
```
You can see that the first two keys `add_new_panel` and `title` are our fixed app keys and the other two keys are custom
project keys. If you set `lang` to a language that we don't support and omit certain translations in your config,
we will display those in English. If you don't provide a translation for a custom key, it will be displayed just as-is.
Also notice how the `manifest` key is being set to a different word for `special_collection`.

## Bookmarking

You can save and share your current view with the bookmarking feature.
This is useful e.g. when you want to create TIDO-Link from a search result or comparing multiple texts and
share it to a colleague.

### How it works
TIDO reads and creates a string that is assigned as value to the `tido` GET-parameter at the URL.
We inherit the principles of the [IIIF Content State API](https://iiif.io/api/content-state/1.0/) and use a similar approach.
The value of the `tido` GET-Parameter can be either a URL that returns a `TidoContentState` JSON or
an encoded `TidoContentState` JSON string. The `TidoContentState` contains all the information needed to recreate
a certain panel configuration. If users want to create a new sharable state, they can click the "Share"-button in the app
header and copy the resulting link.

### Working with the state object
We export a TypeScript interface `TidoContentState` where you can inspect the structure of the state object.
Here is an example:
```
{
  type: 'Annotation'
  motivation: ['contentState']
  target: [
    {
      id: 'https://example.com/my-item-1',
      type: 'Item',
      partOf: {
        id: 'https://example.com/my-manifest-1'
        type: 'Manifest'
        partOf: {
          id: 'https://example.com/my-collection-1'
          type: 'Collection'
        }
      },
      state: {
        mode: 'split'
      }
    }
  ]
}
```

This object would open one panel load the content `https://example.com/my-item-1` into it. Since TIDO panels need further
information from a manifest and collection, you need to provide those URLs using the `partOf` key. This is compliant
with the `PanelConfig` object from the [configuration](#the-keys-in-detail).
Please note that the `Item` and `Manifest` targets are not required. TIDO will load the first elements from the respective sequences.
You can append the `state` key to the "root" target to specify further the state of a panel. Currently only the `mode`
configuration can be applied.

### Encoding/Decoding
We provide the `encodeState` and `decodeState` functions as export in our npm package. You can use them like this:

```JavaScript
import { encodeState, decodeState } from 'tido'

const encoded = await encodeState(myState)
const decoded = await decodeState(encoded)
```

In case you want to implement the mechanism yourself, here is the procedure:

- Encoding:
  1. JSON-stringify the state object
  2. GZIP-compress the JSON string
  3. Base64 encode the compressed string
  4. Convert to Base64URL (replace + with - and / with _, remove = )

- Decoding:
  1. Convert Base64URL to Base64
  2. Convert Base64 to binary
  3. GZIP-decompress the binary
  4. Parse JSON string to object

## Text Sanitization

TIDO uses [DOMPurify](https://github.com/cure53/DOMPurify) to sanitize the incoming text in order to provide
the best security possible while working with dynamic HTML strings.
We **extend** the [default configuration](https://github.com/cure53/DOMPurify/blob/main/src) of DOMPurify
with the followings:

### Forbidden Tags

- `input`
- `script`
- `noscript`
- `iframe`
- `frame`
- `frameset`
- `noframes`
- `applet`
- `base`
- `meta`
- `form`

### Allowed Attributes

- `target`
- `rel`

## Getting Started (Developers)

### Prerequisites

To get TIDO up and running you should have the following software installed:

- **npm**
- **nvm**

**Note**:

We recommend to make use of `nvm`, since there might be issues with npm regarding permissions.
The main purpose of `nvm` is to have multiple node versions installed in regards to different projects which might demand some sort of backwards compatibility.
It enables you to just switch to the appropriate node version.
Besides it also keeps track of resolving permission issues, since all your global installations go to your home directory (~/.nvm/) instead of being applied systemwide.

### Install

#### Set up `nvm` and the recent stable version of `node.js`

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install stable
```

**Note**:
After the nvm installation is done, please `restart` your shell session once. That's due to changes to your profile environment.

#### Clone the Repository

```bash
git clone git@github.com:subugoe/tido.git
git checkout next
```

#### Get the Dependencies

Head over to your project directory, where you just cloned the repository to as described above and get all the dependencies needed by typing:

```bash
cd /path/to/projectdir
npm install
```

That's it. You should now be able to run the Viewer.

### Build

Please run this command to create a production build.

```bash
npm run build
```

The output files are located at `/dist`.

### Local Development

#### Serve Development Build

Builds the app in `development mode` (hot reloading, error reporting, etc.).

```bash
npm run dev
```

Check `examples/config` to find more configurations that we have prepared. You can then run `npm run dev [name]` to load
that specific config. Example:

```bash
npm run dev 4w
```
Also, you can modify `/index.html` to load your required TIDO configuration.

The development build will be available under `localhost:5173`.

#### Preview Production Build with examples

You can also inspect some example TIDO configurations that we provide under `/examples`.
Run this command which will create a TIDO production build, copy the result files into `/examples`
and start up a local web server:

```bash
npm run preview:examples
```

These examples are available under `localhost:2222`. Each example has its own HTML file:

- `http://localhost:2222/[example-name].html`

#### Start Mock API

We provide several mock JSON files in order to create API endpoints for testing purposes.
You can start your own local API server with this command:

```bash
npm run api
```

The server will be available at `localhost:8181`. Check out `/tests/mocks` inspect the files.

### Testing

We run tests only on production code. So you need to make sure to create a TIDO build before starting to run tests.

#### Quick Test Run

This is a minimal command to run tests once on your local machine.

- `npm run api & npm run test`

#### Testing In Detail

If you want to gain more control during development you can do the following.
Prepare the environment before running the tests:

- `npm run api`
- `npm run preview:examples`

Now you can run the tests on your local machine with a proper Cypress UI and selective steps
or run the tests only in headless mode which will prompt the results on the console.

- `npm run cypress` or `npm run cypress:headless`

### Linting

```bash
npm run lint            # to lint all the files at once
npm run lint:js         # to lint js files only
npm run lint:markdown   # to lint the markdown
npm run lint:scss       # to lint the styles
npm run lint:vue        # to lint vue files only
```

### Generate TextAPI support table

We maintain a JSON file (`/.validation/support-matrix.json`) that keeps track of supported TextAPI features.
If you need to recreate that file and rerender `/SUPPORT.md`, here is an explanation:

- Make sure you run NodeJS version >= 20
- Set `GITLAB_ACCESS_TOKEN` in `/.env` file
- Run `node ./.validation/create-support-matrix.js`
- Inspect `/.validation/support-matrix.json`, all status values are set to 0 (= not supported) by default
- Edit the statuses manually: 0 = not supported, 1 = supported, 2 = partially supported, 3 = unused
- Run `node ./.validation/create-support-matrix.js` again to generate new `/SUPPORT.md`

## TextAPI Support
Please view this document to see an overview of supported TextAPI features: [State of TextAPI support](SUPPORT.md)


## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://gitlab.gwdg.de/subugoe/emo/tido/-/tags).

## Authors

See the list of [contributors](https://github.com/subugoe/tido/graphs/contributors) who participated in this project.
