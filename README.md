# TIDO

Text vIewer for Digital Objects.
With this project we provide a highly configurable viewer for projects that implement the [TextAPI](https://subugoe.pages.gwdg.de/emo/text-api/).


## Overview

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Preview](#preview)
- [Getting Started](#getting-started)
  - [Get the Viewer](#get-the-viewer)
    - [Registry setup](#registry-setup)
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
- [Getting Started (Developers)](#getting-started-developers)
  - [Prerequisites](#prerequisites)
  - [Environment setup](#environment-setup)
    - [Set up `nvm` and the recent stable version of `node.js`](#set-up-nvm-and-the-recent-stable-version-of-nodejs)
    - [Clone the repository](#clone-the-repository)
    - [Get the dependencies](#get-the-dependencies)
  - [Usage](#usage)
    - [`development mode` (hot reloading, error reporting, etc.)](#development-mode-hot-reloading-error-reporting-etc)
    - [Mock API](#mock-api)
    - [Building the app for production](#building-the-app-for-production)
    - [Testing](#testing)
      - [Local](#local)
      - [CI](#ci)
    - [Linting](#linting)
- [Viewer Architecture](#viewer-architecture)
- [Dockerfile](#dockerfile)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Preview

You can preview TIDO at Gitlab Pages with different configurations to compare with.
Generally the deployment to Pages runs at every branch.

You can access the preview with the following URL syntax:

`[Gitlab Pages base URL]/[branch-name]/config-tester/[project].html`

List of preview configurations:

- [Ahiqar Syriac](https://subugoe.pages.gwdg.de/emo/tido/main/config-tester/ahiqar-syriac.html)
- [Ahiqar Arabic Karshuni](https://subugoe.pages.gwdg.de/emo/tido/main/config-tester/ahiqar-arabic-karshuni.html)
- [GFL](https://subugoe.pages.gwdg.de/emo/tido/main/config-tester/gfl.html)

## Getting Started

TiDO is provided as **npm package**. Please follow the steps below to include it for production:

### Get the Viewer

#### Registry setup

Since npm communicates with the package API, it is necessary to setup a valid endpoint.

```bash
echo @subugoe:registry=https://gitlab.gwdg.de/api/v4/packages/npm/ >>.npmrc
```

**Note**: fire this command inside the **root** of your **project directory**.

#### Installation

```bash
npm i @subugoe/tido
```

### Integration

Add this line to your **main.js** file:

```js
import '@subugoe/tido/dist/tido'
```

TODO: a sentence about embedded TIDO.

## Configuration

Minimal example:
```html
<script>
  const tido = new Tido({
    manifest: 'https://example.com/textapi/manifest.json'
  });
</script>
```
TIDO requires an entrypoint URL to be useful at all. You can provide either a `collection` or a `manifest` key
and additionally provide an `item` key to start a certain item with a sequence. Technically you could also provide
a single `item` key only, but it is recommended to use manifests as wrappers.

By default, TIDO will render three panels displaying sequence tree, text content and metadata views.
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
                    "icon": "biPersonFill",
                  },
                  {
                    "name": "Place",
                    "icon": "biGeoAltFill",
                  },
                  {
                    "name": "Editorial Comment",
                    "icon": "biChatFill",
                  },
                  {
                    "name": "Reference",
                    "icon": "biBoxArrowUpRight",
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
                    "icon": "biPenFill",
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
| types[i].icon           | String                 | `null`       | Specifies the icon name that should be used in the annotation item. TIDO uses Bootstrap Icons, please lookup the allowed values [here](https://github.com/quasarframework/quasar/blob/dev/extras/bootstrap-icons/icons.json) |
| types[i].displayWhen    | String                 | `null`       | Text content type that was specified under [Text options](#text). Annotation will only be shown if that content type is currently active.                                                                                    |
| types[i].annotationType | String                 | `annotation` | Controls the look of the annotation item. Allowed values: `annotation` or `text`. Currently the only difference is that there is no icon at type `text`.                                                                     |


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

### Environment setup

#### Set up `nvm` and the recent stable version of `node.js`

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install stable
```

**Note**:
After the nvm installation is done, please `restart` your shell session once. That's due to changes to your profile environment.


#### Clone the repository

```bash
git clone git@gitlab.gwdg.de:subugoe/emo/tido.git
```

#### Get the dependencies

Head over to your project directory, where you just cloned the repository to as described above and get all the dependencies needed by typing:

```bash
cd /path/to/projectdir
npm install
```

That's it. You should now be able to run the Viewer.

### Usage

#### `development mode` (hot reloading, error reporting, etc.)

```bash
npm run serve:dev
```

(usually located at: `localhost:8080` since this port isn't already occupied)

#### Mock API
You can start your own local API server which will serve Text API responses from `tests/mocks`.
The folder structure represents a portion of resources of the Ahiqar project.

```bash
npm run mock-api
```

The server will be available at `localhost:8181`.


#### Building the app for production

```bash
npm run build
```

You can also run `npm run serve:prod` which will copy the `dist` files into the `examples` directory
and create a web server under `http://localhost:2222`. Now you are able to access the examples like this:

- `http://localhost:2222/[example-name].html`


#### Testing

We run tests only on production code. So you need to make sure to create a Tido build before starting to run tests.
TIDO follows the "Zero Config" policy but projects can provide a very detailed config that can drastically change the behaviour of the app.
Therefor we provide some example configurations from previous implementation projects that cover the most important features.

Following examples are available under (`examples/`):
- `ahiqar-arabic-karshuni.html`
- `ahiqar-arabic-karshuni-local.html`
- `ahiqar-syriac.html`
- `gfl.html`
- `zero-config.html`

##### Local

Prepare the environment before running the tests.

- `npm run build`
- `npm run mock-api`
- `npm run serve:prod`

Now you can run the tests on your local machine with a proper Cypress UI and selective steps
or run the tests only in headless more which will prompt the results on the console.

- `npm run cypress` or `npm run cypress:headless`

##### CI

You can use a one-line command which will start the mock API server and run tests in headless mode
after it has connected to that mock API server.

- `npm run build`
- `npm run test:e2e`

#### Linting

```bash
npm run lint            # to lint all the files at once
npm run lint:js         # to lint js files only
npm run lint:markdown   # to lint the markdown
npm run lint:scss       # to lint the styles
npm run lint:vue        # to lint vue files only
```


## Viewer Architecture

![Viewer components](img/Viewer.png)

## Dockerfile

The dockerfile is used for GitLab CI.
It needs to be updated when either `node` or `quasar-cli` should be updated.

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
