# TIDO

Text vIewer for Digital Objects.
With this project we provide a highly configurable viewer for projects that implement the [TextAPI](https://subugoe.pages.gwdg.de/emo/text-api/).

## Overview

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Get the Viewer](#get-the-viewer)
    - [Registry Setup](#registry-setup)
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
- [Bookmarking](#bookmarking)
- [Getting Started (Developers)](#getting-started-developers)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
    - [Set up `nvm` and the recent stable version of `node.js`](#set-up-nvm-and-the-recent-stable-version-of-nodejs)
    - [Clone the Repository](#clone-the-repository)
    - [Get the Dependencies](#get-the-dependencies)
  - [Build](#build)
  - [Serve Locally](#serve-locally)
    - [Serve Development Build](#serve-development-build)
    - [Serve Examples (Production Build)](#serve-examples-production-build)
    - [Serve Mock API](#serve-mock-api)
  - [Testing](#testing)
    - [Local](#local)
    - [CI](#ci)
  - [Linting](#linting)
  - [Generate TextAPI support table](#generate-textapi-support-table)
- [TextAPI Support](#textapi-support)
- [Viewer Architecture](#viewer-architecture)
- [Dockerfile](#dockerfile)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Demo

You can preview TIDO at GitLab Pages with different configurations to compare with.
Generally the deployment to Pages runs at every branch.

You can access the preview with the following URL syntax:

`[GitLab Pages base URL]/[branch-name]/config-tester/[project].html`

**List of preview configurations:**

- [Ahiqar Textual Witnesses In Syriac](https://subugoe.pages.gwdg.de/emo/tido/main/examples/ahiqar-syriac.html)
- [Ahiqar Textual Witnesses In Arabic And Karshuni](https://subugoe.pages.gwdg.de/emo/tido/main/examples/ahiqar-arabic-karshuni.html)
- [Goethes Farbenlehre in Berlin](https://subugoe.pages.gwdg.de/emo/tido/main/examples/gfl.html)
- [Zero Config](https://subugoe.pages.gwdg.de/emo/tido/main/examples/zero-config.html?collection=https%3A%2F%2Fahiqar.uni-goettingen.de%2Fapi%2Ftextapi%2Fahikar%2Fsyriac%2Fcollection.json)
  (here you can append an entrypoint URL parameter like `?collection=https://example.com`. For more details, please check the [Bookmarking](#bookmarking) section.)

## Getting Started

TIDO is provided as **npm package**. Please follow the steps below to include it for production:

### Get the Viewer

#### Registry Setup

Since npm communicates with the package API, it is necessary to setup a valid endpoint.

```bash
echo @subugoe:registry=https://gitlab.gwdg.de/api/v4/packages/npm/ >>.npmrc
```

**Note**: Fire this command inside the **root** of your **project directory**.

#### Installation

```bash
npm i @subugoe/tido
```

### Integration

1. Add these two files to your application: `tido.js` and `tido.css`.

HTML:

```html
<link href="/node_modules/@subugoe/tido/dist/tido.css" rel="stylesheet">
<script src="/node_modules/@subugoe/tido/dist/tido.js"></script>
```

JS:

```js
import '@subugoe/tido/dist/tido.js'
import '@subugoe/tido/dist/tido.css'
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

TIDO requires an entrypoint URL to be useful at all. You can provide either a `collection` or a `manifest` key
and additionally provide an `item` key to start a certain item with a sequence. Technically you could also provide
a single `item` key only, but it is recommended to use manifests as wrappers.

By default, TIDO will render five panels displaying sequence tree, metadata, image, text content and annotation views.
Nevertheless, you can fully customize the viewer's behaviour.

There are options to

- add/remove multiple panels
- freely combine view components in panels
- show/hide header features
- change the color scheme
- and **more** ...

Real world example:

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
                    "index": "biPersonFill",
                  },
                  {
                    "name": "Place",
                    "index": "biGeoAltFill",
                  },
                  {
                    "name": "Editorial Comment",
                    "index": "biChatFill",
                  },
                  {
                    "name": "Reference",
                    "index": "biBoxArrowUpRight",
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
                    "index": "biPenFill",
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
        "contents_and_metadata": "Contents & Metadata"
      }
    }
  }
</script>
```

### The Keys in Detail

| Name                                    | Type          | Default   | Description                                                                                                                                                                                                        |
|-----------------------------------------|---------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| collection                              | String        | null      | Specifies a collection endpoint URL. Will be prioritized over `manifest` key.                                                                                                                                      |
| colors                                  | Object        | &darr;    | Sets custom theme colors. If any value is left blank (e.g. `"primary": "",`), a default color scheme will be used.                                                                                                 |
| colors.forceMode                        | String        | `light`   | Enforces the initial color mod despite the browser settings. Supported values: `light`, `dark`, `none`.                                                                                                            |
| colors.primary                          | String        | `#477fbf` | Used as main color in buttons, active states, highlights                                                                                                                                                           |
| colors.secondary                        | String        | `#eeeeee` | Can be used as contrast or background color                                                                                                                                                                        |
| colors.accent                           | Srring        | `empty`   |                                                                                                                                                                                                                    |
| container                               | String        | `#app`    | Specifies the CSS selector where we should append the TIDO app to.                                                                                                                                                 |
| header                                  | Object        | &darr;    | Controls the elements in the section above the content                                                                                                                                                             |
| header.show                             | Boolean       | `true`    | Toggle visibility of the whole header                                                                                                                                                                              |
| header.navigation                       | Boolean       | `true`    | Toggle visibility of prev/next buttons                                                                                                                                                                             |
| header.panelsToggle                     | Boolean       | `true`    | Toggle visibility of panel toggle buttons                                                                                                                                                                          |
| header.languageSwitch                   | Boolean       | `false`   | Toggle visibility of language switch for supported languages                                                                                                                                                       |
| item                                    | String        | null      | Specifies an item endpoint URL.                                                                                                                                                                                    |
| lang                                    | String        | `en`      | Sets the default language. Possible supported values: `en` , `de`                                                                                                                                                  |
| manifest                                | String        | null      | Specifies a manifest endpoint URL. Will be ignored when there is a `collection` key specified.                                                                                                                     |
| notificationColors                      | Object        | &darr;    | Sets custom notification colors. Used in error messages.                                                                                                                                                           |
| notificationColors.info                 | String        | `blue-9`  | Sets the info level color.                                                                                                                                                                                         |
| notificationColors.warning              | String        | `red-9`   | Sets the warning level color.                                                                                                                                                                                      |
| panels                                  | PanelConfig[] | &darr;    | Defines an array of panel objects. The panels will appear in the same order.                                                                                                                                       |
| panels[i].label                         | String        | `Panel i` | Sets the label which appears in the panel header. If there is only one view in the panel then the view label will be displayed instead. Translatable.                                                              |
| panels[i].views                         | ViewConfig[]  | &darr;    | Defines an array of views inside of a panel. If there are multiple views, we display them in tabs. If there is only one view we omit the tabs and display the view directly inside the panel.                      |
| panels[i].views[j].id                   | String        | `view-j`  | Unique identifier for the view across the app.                                                                                                                                                                     |
| panels[i].views[j].label                | String        | `View j`  | Sets the label which appears in the tab header. If there is only one view then this label will be displayed as panel header label. Translatable.                                                                   |
| panels[i].views[j].default              | Boolean       | `false`   | Specifies whether this view should be visible at the initial start of the app. If no `default` keys provided on views or all `default` keys are set to `false`, then the first view will be considered as default. |
| panels[i].views[j].connector            | Object        | &darr;    | Defines which view component and its options. Each view can have its own arbitrary config options.                                                                                                                 |
| panels[i].views[j].connector.id         | Number        | null      | Defines the component id which will be rendered dynamically for this view. See view connectors.                                                                                                                    |
| panels[i].views[j].connector.options    | Object        | null      | Defines options for individual view components. Each view component has different options. See view connector options.                                                                                             |
| translations                            | Object        | null      | Specifies a custom translations object.                                                                                                                                                                            |
| translations.[langKey]                  | Object        | null      | Defines a translation object for supported languages with the respective `langKey` which can have following values: `en`, `de`.                                                                                    |
| translations.[langKey].[translationKey] | String        | null      | Defines a translation key/value pair for a supported language. You can override existing key/value pairs or define custom key/value pairs.                                                                         |

### View Connectors

TIDO can be configured to display dynamic panel with dynamic views inside. In order to tell TIDO how the panels and views should be rendered,
you need to assign the right connectors in the config. This is done via component IDs which currently are plain integers.
Below you can find a list of available components.

| ID  | Name        | Description                                                                                                         |
|-----|-------------|---------------------------------------------------------------------------------------------------------------------|
| 1   | Tree        | Displays an expandable/collapsible tree view that renders TextAPi sequences.                                        |
| 2   | Metadata    | Displays dynamic metadata from collection, manifest and item levels.                                                |
| 3   | Image       | Displays the image resource from the item in an OpenSeadragon instance.                                             |
| 4   | Text        | Displays one text type from the item. Loads a support CSS file it provided. Handles text highlighting and selecting |
| 5   | Annotations | Displays a list of annotations. Handles selecting.                                                                  |

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

| Name                    | Type                   | Default      | Description                                                                                                                                                                                                                  |
|-------------------------|------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| types                   | AnnotationTypeConfig[] | `[]`         | Defines annotation types that should be displayed in this view. The Annotation API response will then be filtered according to this config.                                                                                  |
| types[i].name           | String                 | `null`       | Specifies the name which corresponds to the `x-content-type` property from annotations response.                                                                                                                             |
| types[i].index           | String                 | `null`       | Specifies the index name that should be used in the annotation item. TIDO uses Bootstrap Icons, please lookup the allowed values [here](https://github.com/quasarframework/quasar/blob/dev/extras/bootstrap-icons/icons.json) |
| types[i].displayWhen    | String                 | `null`       | Text content type that was specified under [Text options](#text). Annotation will only be shown if that content type is currently active.                                                                                    |
| types[i].annotationType | String                 | `annotation` | Controls the look of the annotation item. Allowed values: `annotation` or `text`. Currently the only difference is that there is no index at type `text`.                                                                     |

## Bookmarking

TIDO will reflect certain state changes to the URL so you can save and share your current view.

The new bookmarking concept has only one 'key':'value' pair. The 'key' is 'tido' and the 'value' are the settings of the currently opened view.
Full example of new bookmarking concept: http://localhost:5173/?tido=m0_i1_s0-2-3_p0.0-1.0-2.0-3.1.

The value consists of 4 parts: 
1. Manifest part: m0
2. Item part: i1
3. Opened panels:  s0-2-3
4. Visible tab for each panel:  p0.0-1.0-2.0-3.1

Features
  - URL Logic Tree (having a few config sets, the URL should be updated accordingly)
  - When opening a new item in the same or a new manifest, the item index and/or the manifest index in the URL changes accordingly
  - When opening/closing a panel, the "opened panels" part is updated
  - When making a certain tab visible, this change is reflected in the 4th part 'Visible tab for each panel'
  - If a researcher has been given the URL settings of a certain item, he can open it, by providing it in the URL part of the browser 
  - Error handling for each URL part
Structure of each part should be given as input as specified in this page
Manifest index and/or item index should be given inside the appropriate value range
  - Other

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
git clone git@gitlab.gwdg.de:subugoe/emo/tido.git
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

### Serve Locally

#### Serve Development Build

Builds the app in `development mode` (hot reloading, error reporting, etc.).

```bash
npm run serve:dev
```

It will be available under `localhost:5173`.

#### Serve Examples (Production Build)

You can serve a production build by viewing example configurations that we provide under `/examples`.
Run this command which will create a TIDO production build and copy the result files into `/examples`:

```bash
npm run serve:prod
```

This examples are available under `localhost:2222`. Each example has its own HTML file:

- `http://localhost:2222/[example-name].html`

#### Serve Mock API

You can start your own local API server which will serve TextAPI responses from `tests/mocks`.
The folder structure represents a portion of resources of the Ahiqar project.

```bash
npm run serve:mock-api
```

The server will be available at `localhost:8181`.

### Testing

We run tests only on production code. So you need to make sure to create a TIDO build before starting to run tests.
TIDO follows the "Zero Config" policy but projects can provide a very detailed config that can drastically change the behaviour of the app.
Therefor we provide some example configurations from previous implementation projects that cover the most important features.

Following examples are available under (`examples/`):

- `ahiqar-arabic-karshuni.html`
- `ahiqar-arabic-karshuni-local.html`
- `ahiqar-syriac.html`
- `gfl.html`
- `zero-config.html`

#### Local

Prepare the environment before running the tests.

- `npm run build`
- `npm run serve:mock-api`
- `npm run serve:prod`

Now you can run the tests on your local machine with a proper Cypress UI and selective steps
or run the tests only in headless more which will prompt the results on the console.

- `npm run cypress` or `npm run cypress:headless`

#### CI

You can use a one-line command which will start the mock API server and run tests in headless mode
after it has connected to that mock API server.

- `npm run build`
- `npm run test:e2e`

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


## Viewer Architecture

![Viewer components](img/Viewer.png)

## Dockerfile

The Dockerfile is used for GitLab CI.

```bash
docker build --pull -t docker.gitlab.gwdg.de/subugoe/emo/tido/node .
docker push docker.gitlab.gwdg.de/subugoe/emo/tido/node
```

## Architecture

![Architecture diagram of TIDO](img/emo_architecture.png)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://gitlab.gwdg.de/subugoe/emo/tido/-/tags).

## Authors

See the list of [contributors](https://gitlab.gwdg.de/subugoe/emo/tido/-/graphs/develop) who participated in this project.
First line added!
