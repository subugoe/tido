# TIDO

Text vIewer for Digital Objects.
With this project we provide a highly configurable viewer for projects that implement the [TextAPI](https://subugoe.pages.gwdg.de/emo/text-api/).

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
- [Configuration](#configuration)
  - [The Keys in Detail](#the-keys-in-detail)
  - [View Connectors](#view-connectors)
    - [Options](#options)
      - [Tree](#tree)
      - [Metadata](#metadata)
      - [Image](#image)
      - [Text](#text)
      - [Annotations](#annotations)
        - [Icons](#icons)
  - [Translations](#translations)
- [Methods](#methods)
- [Bookmarking](#bookmarking)
- [Getting Started (Developers)](#getting-started-developers)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
    - [Set up `nvm` and the recent stable version of `node.js`](#set-up-nvm-and-the-recent-stable-version-of-nodejs)
    - [Clone the Repository](#clone-the-repository)
    - [Get the Dependencies](#get-the-dependencies)
  - [Build](#build)
  - [Local Development](#local-development)
    - [Serve Development Build](#serve-development-build)
    - [Preview Production Build](#preview-production-build)
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
npm i tido
```

### Integration

1. Add these two files to your application: `tido.js` and `tido.css`.

HTML:

```html
<link href="/node_modules/tido/dist/tido.css" rel="stylesheet">
<script src="/node_modules/tido/dist/tido.js"></script>
```

JS:

```js
import 'tido/dist/tido.js'
import 'tido/dist/tido.css'
```

2. Add a container element to your application where TIDO can hook into.
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
    manifest: 'https://example.com/textapi/manifest.json'
  });
</script>
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
    "collection": "http://localhost:8181/ahiqar/arabic-karshuni/collection.json",
    "panels": [
      {
        "label": "contents_and_metadata",
        "views": [
          {
            "id": "tree",
            "label": "contents",
            "connector": {
              "id": 1,
              "options": {
                "labels": {
                  "item": "Sheet",
                  "manifest": "Manuscript"
                }
              }
            }
          },
          {
            "id": "metadata",
            "label": "metadata",
            "connector": {
              "id": 2,
              "options": {
                "collection": {
                  "all": true
                },
                "manifest": {
                  "all": true
                },
                "item": {
                  "all": true
                }
              }
            }
          }
        ]
      },
      {
        "label": "image",
        "views": [
          {
          "id": "image",
          "label": "Image",
          "connector": {
            "id": 3
          }
        }]
      },
      {
        "label": "text",
        "width": 1.5,
        "views": [
          {
            "id": "text1",
            "label": "Transcription",
            "default": true,
            "connector": {
              "id": 4,
              "options": {
                "type": "transcription"
              }
            }
          },
          {
            "id": "text2",
            "label": "Transliteration",
            "connector": {
              "id": 4,
              "options": {
                "type": "transliteration"
              }
            }
          }
        ]
      },
      {
        "label": "annotations",
        "views": [
          {
            "id": "annotations1",
            "label": "Editorial",
            "default": true,
            "connector": {
              "id": 5,
              "options": {
                "types": [
                  {
                    "name": "Person",
                    "index": "person",
                  },
                  {
                    "name": "Place",
                    "index": "marker",
                  },
                  {
                    "name": "Editorial Comment",
                    "index": "chat",
                  },
                  {
                    "name": "Reference",
                    "index": "externalLink",
                  }
                ]
              }
            }
          },
          {
            "id": "annotations2",
            "label": "Motif",
            "connector": {
              "id": 5,
              "options": {
                "types": [
                  {
                    "name": "Motif",
                    "index": "pen",
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    "translations": {
      "en": {
        "contents_and_metadata": "Contents & Metadata",
        "next_item": "Next Sheet",
        "previous_item": "Previous Sheet",
        "next_manifest": "Next Manuscript",
        "previous_manifest": "Previous Manuscript",
        "item": "Sheet"
      }
    }
  }
</script>
```

</details>

### The Keys in Detail

| Name                                    | Type          | Default   | Description                                                                                                                                                                                                                     |
|-----------------------------------------|---------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| collection                              | String        | null      | Specifies a collection endpoint URL. Will be prioritized over `manifest` key.                                                                                                                                                   |
| colors                                  | Object        | &darr;    | Sets custom theme colors. If any value is left blank (e.g. `"primary": "",`), a default color scheme will be used.                                                                                                              |
| colors.forceMode                        | String        | `light`   | Enforces the initial color mod despite the browser settings. Supported values: `light`, `dark`, `none`.                                                                                                                         |
| colors.primary                          | String        | `#477fbf` | Used as main color in buttons, active states, highlights                                                                                                                                                                        |
| colors.secondary                        | String        | `#eeeeee` | Can be used as contrast or background color                                                                                                                                                                                     |
| container                               | String        | `#app`    | Specifies the CSS selector where we should append the TIDO app to.                                                                                                                                                              |
| header                                  | Object        | &darr;    | Controls the elements in the section above the content                                                                                                                                                                          |
| header.show                             | Boolean       | `true`    | Toggle visibility of the whole header                                                                                                                                                                                           |
| header.navigation                       | Boolean       | `true`    | Toggle visibility of prev/next buttons                                                                                                                                                                                          |
| header.panelsToggle                     | Boolean       | `true`    | Toggle visibility of panel toggle buttons                                                                                                                                                                                       |
| header.languageSwitch                   | Boolean       | `false`   | Toggle visibility of language switch for supported languages                                                                                                                                                                    |
| lang                                    | String        | `en`      | Sets the default language. Possible supported values: `en` , `de`                                                                                                                                                               |
| manifest                                | String        | null      | Specifies a manifest endpoint URL. Will be ignored when there is a `collection` key specified.                                                                                                                                  |
| panels                                  | PanelConfig[] | &darr;    | Defines an array of panel objects. The panels will appear in the same order.                                                                                                                                                    |
| panels[i].label                         | String        | `Panel i` | Sets the label which appears in the panel header. If there is only one view in the panel then the view label will be displayed instead. Translatable.                                                                           |
| panels[i].views                         | ViewConfig[]  | &darr;    | Defines an array of views inside of a panel. If there are multiple views, we display them in tabs. If there is only one view we omit the tabs and display the view directly inside the panel.                                   |
| panels[i].width                         | Number        | 1         | Defines a width multiplier to a panel default width. Values between 1 and 10 are allowed. Float values allowed. Causes horizontal overflow. Ignored on mobile screens since the default width takes the whole screen width.     |
| panels[i].views[j].id                   | String        | `view-j`  | Unique identifier for the view across the app.                                                                                                                                                                                  |
| panels[i].views[j].label                | String        | `View j`  | Sets the label which appears in the tab header. If there is only one view then this label will be displayed as panel header label. Translatable.                                                                                |
| panels[i].views[j].default              | Boolean       | `false`   | Specifies whether this view should be visible at the initial start of the app. If no `default` keys provided on views or all `default` keys are set to `false`, then the first view will be considered as default.              |
| panels[i].views[j].connector            | Object        | &darr;    | Defines which view component and its options. Each view can have its own arbitrary config options.                                                                                                                              |
| panels[i].views[j].connector.id         | Number        | null      | Defines the component id which will be rendered dynamically for this view. See view connectors.                                                                                                                                 |
| panels[i].views[j].connector.options    | Object        | null      | Defines options for individual view components. Each view component has different options. See view connector options.                                                                                                          |
| translations                            | Object        | null      | Specifies a custom translations object.                                                                                                                                                                                         |
| translations.[langKey]                  | Object        | null      | Defines a translation object for supported languages with the respective `langKey` which can have following values: `en`, `de`.                                                                                                 |
| translations.[langKey].[translationKey] | String        | null      | Defines a translation key/value pair for a supported language. You can override existing key/value pairs or define custom key/value pairs. There is a [list](#translations) that we expose for overriding in the configuration. |

### View Connectors

TIDO can be configured to display dynamic panel with dynamic views inside. In order to tell TIDO how the panels and views should be rendered,
you need to assign the right connectors in the config. This is done via component IDs which currently are plain integers.
Below you can find a list of available components.

| ID  | Name        | Description                                                                                                                                                               |
|-----|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1   | Tree        | Displays an expandable/collapsible tree view that renders TextAPi sequences.                                                                                              |
| 2   | Metadata    | Displays dynamic metadata from collection, manifest and item levels.                                                                                                      |
| 3   | Image       | Displays the image resource from the item in an OpenSeadragon instance.                                                                                                   |
| 4   | Text        | Displays one text type from the item. Loads a support CSS file it provided. Handles text highlighting and selecting                                                       |
| 5   | Annotations | Displays a list of annotations. Handles selecting.                                                                                                                        |
 | 6 | Variants | Displays a list variants with their corresponding witnesses. Enables to filter variants by witness. Provides a "single select mode" to pick variants from the text panel. |

#### Options

Each view component can be configured via an `options` object that can be passed at the connector.
Here is an overview of available options:

##### Tree

| Name               | Type   | Default      | Description                                                                                                                                                                                                         |
|--------------------|--------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| labels             | Object | null         | You can overwrite default labels of tree nodes.                                                                                                                                                                     |
| labels["item"]     | String | `"page"`     | Label prefix for an item tree node. The item number in the sequence will be appended. It will be displayed when no other label is given by the item itself. The output could look like this: `"Page 3"`             |
| labels["manifest"] | String | `"manifest"` | Label prefix for an manifest tree node. The manifest number in the sequence will be appended. It will be displayed when no other label is given by the item itself. The output could look like this: `"Manifest 3"` |

##### Metadata

| Name       | Type    | Default | Description                           |
|------------|---------|---------|---------------------------------------|
| collection | Boolean | `true`  | Toggle on/off the collection section. |
| manifest   | Boolean | `true`  | Toggle on/off the manifest section.   |
| item       | Boolean | `true`  | Toggle on/off the item section.       |

##### Image

no options

##### Text

| Name     | Type    | Default | Description                                                                |
|----------|---------|---------|----------------------------------------------------------------------------|
| type     | String  | null    | Specify the content type slug that is served from `item.content` response. |

##### Annotations

| Name                    | Type                   | Default      | Description                                                                                                                                                                                                                   |
|-------------------------|------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| types                   | AnnotationTypeConfig[] | `[]`         | Defines annotation types that should be displayed in this view. The Annotation API response will then be filtered according to this config.                                                                                   |
| types[i].name           | String                 | `null`       | Specifies the name which corresponds to the `x-content-type` property from annotations response.                                                                                                                              |
| types[i].icon           | String                 | `null`       | Specifies an icon that is displayed on the left of the annotation item. Currently we provide only a fixed list of possible icons. [here](#icons)                                                                              |
| types[i].index          | String                 | `null`       | Specifies the index name that should be used in the annotation item. TIDO uses Bootstrap Icons, please lookup the allowed values [here](https://github.com/quasarframework/quasar/blob/dev/extras/bootstrap-icons/icons.json) |
| types[i].displayWhen    | String                 | `null`       | Text content type that was specified under [Text options](#text). Annotation will only be shown if that content type is currently active.                                                                                     |
| types[i].annotationType | String                 | `annotation` | Controls the look of the annotation item. Allowed values: `annotation` or `text`. Currently the only difference is that there is no index at type `text`.                                                                     |

###### Icons

Below you can find a list of icons that can be used for annotation items. Please use these as values for the `icon`
configuration option at annotations.
- `archive`
- `arrowLeft`
- `arrowRight`
- `bank`
- `book`
- `chat`
- `check`
- `code`
- `dropdown`
- `externalLink`
- `fullscreen`
- `info`
- `journals`
- `marker`
- `minus`
- `moon`
- `pen`
- `pencil`
- `person`
- `reset`
- `sun`
- `translate`
- `warning`
- `zoomIn`
- `zoomOut`

### Translations
In the configuration object you are able to set certain translation keys to display your desired texts in the application.
Here is a list of keys that you can override:
- `item`
- `manifest`
- `previous_manifest`
- `next_manifest`
- `next_item`
- `previous_item`


## Methods

The instantiated TIDO Object exposes methods to control TIDO's behaviour programmatically.
Just call them in your outer JavaScript application like this:

```javascript
const tido = new Tido()
tido.someMethod()
```

**Available Methods:**

| Name     | Arguments | Type            | Description                                                                                |
|----------|-----------|-----------------|--------------------------------------------------------------------------------------------|
| setTheme | name      | `dark`, `light` | Sets color theme. The attribute `color-scheme` at the container element will be overridden. |



## Bookmarking

TIDO will reflect certain state changes to the URL so you can save and share your current view.

It appends only one GET parameter. The `key` is `tido` and the `value` are the settings of the current app state.
Full example of the bookmarking concept: `http://localhost:5173/?tido=m0_i1_s0-2-3_p0.0-1.0-2.0-3.1`.

The 'value' consists of 4 parts:
1. Manifest part: m0
2. Item part: i1
3. Visible panels:  s0-2-3
4. Active tab for each panel:  p0.0-1.0-2.0-3.1

Currently we provide the following bookmarking keys:

| Key          | Value         | Description                                                                                                                                    |
|--------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `collection` | URL           | Specifies a collection entrypoint. Will be preferred before `manifest`.                                                                        |
| `manifest`   | URL           | Specifies a manifest entrypoint.                                                                                                               |
| `item`       | URL           | Specifies an item entrypoint. If not set the first possible item will be appended and displayed.                                               |
|  `m`          |  Int: i.e 0             | Specifies the manifest index inside a certain collection. Syntax: `m[manifest index], example: m0`                       |
|  `i`          |  Int: i.e 1            | Specifies the item index of a certain manifest. Syntax: `i[item index], example: i1`     |
| `s`       | `0-1-2`       | Controls the visibility of panels. It's a list of dash-separated panel indexes. All other panels will be hidden. Not set = all visible.  Syntax: `s[index1]-[index2]..., example: s0-1-2`     |
| `p`     | `0.1-1.1-2.1-3.1` | Specifies the active view (tab) in a respective panel. Syntax: `p[panel index1].[view_index1]-[panel index2].[view_index2].. , example p0.1-1.1-2.1-3.1`. Each user interaction will change this parameter. |


**Hint:** With this setup you are able to load your entrypoint dynamically by appending it at the URL instead of rendering
it  via the configuration object inside your wrapper application.

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

You can modify `/index.html` to load your required TIDO configuration. It will be available under `localhost:5173`.

#### Preview Production Build

You can start up a production build with
You can modify `/index.html` to load your required TIDO configuration. It will be available under `localhost:4173`.

#### Preview Production Build with examples

You can also inspect some example TIDO configurations that we provide under `/examples`.
Run this command which will create a TIDO production build, copy the result files into `/examples`
and start up a local web server:

```bash
npm run preview:examples
```


This examples are available under `localhost:2222`. Each example has its own HTML file:

- `http://localhost:2222/[example-name].html`

#### Start Mock API

We provide several mock JSON files in order to create API endpoints for testing purposes.
You can start your own local API server with this command:

```bash
npm run start:mock-api
```

The server will be available at `localhost:8181`. Check out `/tests/mocks` inspect the files.

### Testing

We run tests only on production code. So you need to make sure to create a TIDO build before starting to run tests.
TIDO follows the "Zero Config" policy but projects can provide a very detailed config that can drastically change the behaviour of the app.
Therefore, we provide some example configurations from previous implementation projects that cover the most important features.

Following examples are available under (`/examples`):

- `ahiqar-arabic-karshuni.html`
- `ahiqar-arabic-karshuni-local.html`
- `ahiqar-syriac.html`
- `gfl.html`
- `gfl-local.html`
- `zero-config.html`


#### Quick Test Run

This is a minimal command to run tests once on your local machine.

- `npm run start:mock-api & npm run test`

#### Testing In Detail

If you want to gain more control during development you can do the following.
Prepare the environment before running the tests:

- `npm run start:mock-api`
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

See the list of [contributors](https://gitlab.gwdg.de/subugoe/emo/tido/-/graphs/develop) who participated in this project.
First line added!
