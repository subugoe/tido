# TIDO

Text vIewer for Digital Objects.

**Note:**
Although TIDO is designed as a generic viewer for digital editions, it is currently developed within the scope of the [Ahiqar project](https://gitlab.gwdg.de/subugoe/ahiqar).

This is the reason for "Ahiqar" being mentioned several times in the docs of this repo.

Demo: <https://subugoe.pages.gwdg.de/emo/Qviewer/develop>

(For newer branches the demo is deployed in a directory named with branch name lowercased, shortened to 63 bytes, and with everything except `0-9` and `a-z` replaced with `-` (CI_COMMIT_REF_SLUG).
Also the commit short hash can be used to see a demo.

## Overview

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Latest Version and Integration](#latest-version-and-integration)
  - [Get the Viewer](#get-the-viewer)
    - [Registry setup](#registry-setup)
    - [Installation](#installation)
  - [Integration](#integration)
  - [Config](#config)
- [Getting Started (Developers)](#getting-started-developers)
  - [Prerequisites](#prerequisites)
  - [Environment setup](#environment-setup)
    - [Set up `nvm` and the recent stable version of `node.js`](#set-up-nvm-and-the-recent-stable-version-of-nodejs)
    - [Set up `global` project requirements via `npm`](#set-up-global-project-requirements-via-npm)
    - [Clone the repository](#clone-the-repository)
    - [Get the dependencies](#get-the-dependencies)
  - [Usage](#usage)
    - [`development mode` (hot reloading, error reporting, etc.)](#development-mode-hot-reloading-error-reporting-etc)
    - [`Linting`](#linting)
    - [`Testing`](#testing)
    - [`Building` the app for production](#building-the-app-for-production)
- [Configuration](#configuration)
  - [The Keys in Detail](#the-keys-in-detail)
  - [Configure the Panels](#configure-the-panels)
    - [The Panel Keys in Detail](#the-panel-keys-in-detail)
- [Viewer Architecture](#viewer-architecture)
- [Dockerfile](#dockerfile)
- [Connecting the Viewer to a Backend](#connecting-the-viewer-to-a-backend)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Latest Version and Integration

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

**Note**: `main.js` serves as your *entrypoint* usually located at **/[projectdir]/src/main.js**. It depends on your individual project setup.

### Config

Copy the config object into your **index.html** and follow the instructions given [here](#configuration).

**Note**: Please make sure to provide a valid *entrypoint* that points to the manifest / collection that you want to be displayed.

## Getting Started (Developers)

### Prerequisites

To get TIDO up and running you should have the following software installed:

- **curl**
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

#### Set up `global` project requirements via `npm`

```bash
npm install -g @vue/cli @vue/cli-service-global @quasar/cli
```

#### Clone the repository

```bash
git clone git@gitlab.gwdg.de:subugoe/emo/Qviewer.git
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
npm run dev
```

(usually located at: `localhost:8080` since this port isn't already occupied)

#### `Linting`

```bash
npm run lint            # to lint all the files at once
npm run lint:js         # to lint js files only
npm run lint:markdown   # to lint the markdown
npm run lint:scss       # to lint the styles
npm run lint:vue        # to lint vue files only
```

#### `Testing`

```bash
npm run test:unit
```

The Viewer uses **jest**; a JavaScript test suite.

Tests reside under **tests/unit/specs/** and are supposed to have a file ending of either `*.test.js` or `*.spec.js`.

#### `Building` the app for production

```bash
npm run build
```

**Note**: The complete build is located at `/dist/`.

## Configuration

The Viewer is build with **Vue.js** and **Quasar**.
If you want to change the Quasar configuration, please [refer to their respective docs](https://quasar.dev/quasar-cli/quasar-conf-js) (Configuring quasar.conf.js).

You can fully customize the Viewer's behaviour:

There are options to

- change the color scheme
- show or hide individual bars (info, navigation, toggles)
- group multiple components inside a single panel
- set the order of the panels
- rename labels and / or panel headings
- and **more** ...

As a rule of thumb, each key with a boolean value (e.g. *true* or *false*) defaults to `true` and denotes to show the appropriate element.

```html
<body>
  ...

  <noscript>
    <strong>We're sorry but TiDO doesn't work properly without JavaScript enabled.
      Please enable it to continue.
    </strong>
  </noscript>

  <script id="tido-config" type="application/json">
  {
    "entrypoint": "https://subugoe.pages.gwdg.de/emo/backend/sampledata/collection.json",
    "annotations": {
        "show": true,
        "types": [
          {
            "content-type": "Person",
            "css": "fa-user",
            "icon": "fasUser",
            "label": "Names"
          },
          {
            "content-type": "Place",
            "css": "fa-map-marker-alt",
            "icon": "fasMapMarkerAlt",
            "label": "Places"
          },
          {
            "content-type": "Editorial Comment",
            "css": "fa-comment",
            "icon": "fasComment",
            "label": "Comments"
          }
        ]
      },
      "colors": {
        "primary": "",
        "secondary": "",
        "accent": ""
      },
      "headers": {
        "show": true,
        "info": true,
        "navigation": true,
        "toggle": true
      },
      "labels": {
        "item": "Sheet",
        "manifest": "Manuscript"
      },
      "panels": [
        {
          "connector": [1, 2],
          "heading": true,
          "label": "Contents & Meta",
          "show": true
        },
        {
          "connector": [3],
          "heading": true,
          "label": "Image",
          "show": true
        },
        {
          "connector": [4],
          "heading": true,
          "label": "Text",
          "show": true
        },
        {
          "connector": [5],
          "heading": true,
          "label": "Annotations",
          "show": true
        }
      ],
      "rtl": false,
      "standalone": true
    }  </script>

  <div id="q-app"></div>
</body>

```

**Note**: It's a *JSON* object. So if you are going to make any changes and you have to quote these (e.g. see *labels* or *colors*), please use **double quotes** only.

### The Keys in Detail

- **entrypoint**

  to link the viewer to a backend, the entrypoint should point to the collection you want to be displayed.
  (Further details below: [Connecting the Viewer to a Backend](#connecting-the-viewer-to-a-backend))

  **Note**: You have to provide at least a valid entrypoint (see below). Otherwise the Viewer won't show anything at all!

- **annotations**

  - **show**

      if your API provides *annotations* you can toggle whether to start with all of it highlighted or not

      Defaults to `true`

  - **types**

      the types-array consists of an arbitrary number of objects, each representing an annotation type (e.g. Person, Place, Organization, ...).

      each object in turn consists of similar building blocks:

    - **content-type**

        refers to the **x-content-type** in the **API** you are using.

        **Note**: This content-type should match it's API-counterpart explicitely, otherwise TIDO isn't able to show the related annotations.

    - **css**

        TIDO uses [Font Awesome Icons](https://www.fontawesome.com). Provide a css class that fits your needs.

    - **icon**

        same as above but the related SVG (both are needed)

    - **label**

        The label of the annotation type respectively

- **colors**

  set the colors used in the frontend.

  `primary` and `accent` should be a darker tone, so that white text is visible if used as background. It's the other way around with `secondary`.

  Hex values (like `#a1a1a1`) or color names (like `hotpink`) are fine.

  If any value is left blank (e.g. `"primary": "",`), a default color scheme will be used.

- **headers**

  - **show**

      set this value to `false` if you want to completely switch off all the headerbars at once.  
      This value takes **precedence** over the other *header-keys*.  
      If it is set to `false`, the other settings for the individual bars are not taken into account.

      *(A use case might be to embed the Viewer into an existing website and you simply need more screen space)*

  - **info**

      set this value to `false` if you want to switch off the Infobar (a.k.a. breadcrumbs)  

  - **navigation**

      set this value to `false` if you want to switch off the NavBar

  - **toggle**

      set this value to `false` if you want to switch off the ToggleBar.

      **Note**: if you turn this one off, you won't be able to toggle the panels anymore.

    All header values default to `true`

- **labels**

  - **item**:

      The label of the item respectively  
      Assuming your collection consists of letters, you'd maybe want to name it "letter" or just "sheet" for instance.  
      This change affects the captions of the navbuttons located in the headerbar and the metadata section.

      Defaults to `Sheet`

  - **manifest**:

      Same as for `item` but related to the manifest title.

      Defaults to `Manuscript`

- **rtl (right to left)**

    refers to the direction the text inside the text panel will be displayed.

    set the value to `true` if you want text to be displayed from right to left; e.g. Arabic.

    Defaults to `false`

- **standalone**

    denotes if the Viewer will be used as a single page application or if it will be embedded into an existing page. If you want to use it in the latter case, please toggle the value to `false`. That way the language toggle in the footer section will not show up.

  Defaults to `true`

### Configure the Panels

```json
"panels": [
  {
    "connector": [1],
    "heading": true,
    "label": "Contents",
    "show": true
  },
  {
    "connector": [3],
    "heading": true,
    "label": "Image",
    "show": true
  },
  {
    "connector": [4],
    "heading": true,
    "label": "Text",
    "show": true
  },
  {
    "connector": [2],
    "heading": true,
    "label": "Metadata",
    "show": true
  }
],

```

The panel-array consists of four objects according to the maximum number of panels, that can be shown at once.

Each object inside that constant consists of similar keys: `connector`, `heading`, `label` and `show`.

#### The Panel Keys in Detail

- **connector**

  The numbers below reflect each component's (Text, Image, Meta, ...) id.

  - 1 = Treeview
  - 2 = Metadata
  - 3 = Image
  - 4 = Text
  - 5 = Annotations

  **Note**: These **IDs** are supposed to be **unique**, so please make sure not to repeat these!

  Example given:

  Assuming you want to combine the **Metadata**, **Text** and **Annotations** panels, the configuration could look like this:

  ```json
    {
      "connector": [2, 4, 5],
      "heading": true,
      "label": "Meta, Text & Anno",
      "show": true
    }
  ```

- **heading**

  set this value to false to hide a panel's heading individually

  Defaults to `true`

- **label**

  refers to the heading in each panel's *toolbar*. To rename it, change the corresponding `label` according to your needs.

  **Note**: Please make sure to also change the name, if you are going to reorder the panels or turn them into tabs.

- **show**

  toggles (`show` or rather `hide`) the appropriate panel respectively

- **toggle**

  whether to show the related panel toggle or not

  Defaults to `true`.

**Note**:

## Viewer Architecture

![Viewer components](img/Viewer.png)

## Dockerfile

The dockerfile is used for GitLab CI.  
It needs to be updated when either `node` or `quasar-cli` should be updated.

```bash
docker build --pull -t docker.gitlab.gwdg.de/subugoe/emo/qviewer/node .
docker push docker.gitlab.gwdg.de/subugoe/emo/qviewer/node
```

## Connecting the Viewer to a Backend

The viewer expects JSON that complies to the [SUB's generic TextAPI](https://subugoe.pages.gwdg.de/emo/text-api/) in order to function properly.  
To establish a link to the backend, the viewer's entrypoint in `src/index.template.html` has to be modified:

```html
"entrypoint": "https://{server}{/prefix}/{collection}/collection.json"
```

The entrypoint should point to the collection you want to be displayed.

## Architecture

![Architecture diagram of TIDO](img/emo_architecture.png)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/tags).

## Authors

See the list of [contributors](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/graphs/develop) who participated in this project.
