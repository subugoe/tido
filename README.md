# EMo Viewer

Viewer for the modular framework to present digital editions.

**Note:**
Although the EMo Viewer is designed as a generic viewer for digital editions, it is currently developed within the scope of the [Ahiqar project](https://gitlab.gwdg.de/subugoe/ahiqar).

This is the reason for "Ahiqar" being mentioned several times in the docs of this repo.

Demo: <https://subugoe.pages.gwdg.de/emo/Qviewer/develop>

(For newer branches the demo is deployed in a directory named with branch name lowercased, shortened to 63 bytes, and with everything except `0-9` and `a-z` replaced with `-` (CI_COMMIT_REF_SLUG).
Also the commit short hash can be used to see a demo.

## Overview

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Viewer Components](#viewer-components)
- [Latest Version and Integration](#latest-version-and-integration)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
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
  - [a) Configure the Viewer](#a-configure-the-viewer)
    - [The Keys in Detail](#the-keys-in-detail)
  - [b) Configure the Panels](#b-configure-the-panels)
    - [The Panel Keys in Detail](#the-panel-keys-in-detail)
- [Dockerfile](#dockerfile)
- [Connecting the Viewer to a Backend](#connecting-the-viewer-to-a-backend)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Viewer Components

![Viewer components](img/Viewer.png)

## Latest Version and Integration

To embed the viewer for production [get the latest compiled and minified version](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/jobs/artifacts/develop/download?job=build_main_and_develop)
It is a zip archive. You can extract the build by typing:

```bash
unzip artifacts.zip
```

This creates the following folder structure containing the actual build:

```bash
dist/spa/
├── css
│   ├── 2.5b2a42f3.css
│   ├── app.222a6363.css
│   └── vendor.2303fac8.css
├── index.html
└── js
    ├── 2.5d86d581.js
    ├── app.297a75a4.js
    └── vendor.f055a028.js
```

To include the viewer on a website add the following to your `index.html` file:

```html
  ...

<head>
  ...

  <link href=css/2.[CHECKSUM].css rel=stylesheet>
  <link href=css/app.[CHECKSUM].css rel=stylesheet>
  <link href=css/vendor.[CHECKSUM].css rel=stylesheet>
</head>

<body>
  ...

  <noscript>
    <strong>We're sorry but TextViewer doesn't work properly without JavaScript enabled.
    Please enable it to continue.
    </strong>
  </noscript>

  <script id="emo-config" type="application/json">
    {
      ... // please make sure to copy the whole config object from dist/spa/index.html
    }
  </script>

  <div id=q-app></div>

  <script src=js/2.[CHECKSUM].js></script>
  <script src=js/app.[CHECKSUM].js></script>
  <script src=js/vendor.[CHECKSUM].js></script>
</body>
```

and replace `[CHECKSUM]` with the values from the release you are going to use.

**Note**:

The **CHECKSUMs** change in each build. So please make sure to copy the ones from  **dist/spa/index.html**.

## Getting Started

### Prerequisites

To get the EMo Viewer up and running you should have the following software installed:

- **curl**
- **npm**
- **nvm**

**Note**:

We recommend to make use of `nvm`, since there might be issues with npm regarding permissions.  
The main purpose of `nvm` is to have multiple node versions installed in regards to different projects which might demand some sort of backwards compatibility.  
It enables you to just switch to the appropriate node version.  
Besides it also keeps track of resolving permission issues, since all your global installations go to your home directory (~/.nvm/) instead of being applied systemwide.

### Installation

#### Set up `nvm` and the recent stable version of `node.js`

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
  nvm install node
  nvm install stable
  ```

**Note**:

After the nvm installation is done, please `restart` your shell session once.  
That's due to changes to your profile environment.

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
npm run lint            # to lint js- and vue-files
npm run lint:scss       # to lint the styles
npm run lint:markdown   # to lint the markdown
```

#### `Testing`

```bash
npm run test:unit
```

The Viewer makes use of **jest** in collaboration with the *expect-library*.  
Tests reside under **tests/unit/specs/** and are supposed to have a file ending of either `*.test.js` or `*.spec.js`.

#### `Building` the app for production

```bash
npm run build
```

**Note**: The complete build is located at `/dist/spa/`.

## Configuration

The Viewer is build with *Vue.js* and *Quasar*.
If you want to change the Quasar configuration, please [refer to their respective docs](https://quasar.dev/quasar-cli/quasar-conf-js) (Configuring quasar.conf.js).

There are two files in regards to configuration:

- a) configure the Viewer (**src/index.template.html**)
  - change the color scheme
  - show or hide individual bars (info, navigation, toggles)
  - rename labels
  - usage (standalone / embedded)

- b) configure the panels (**src/config/panels.js**)
  - set the order of the panels
  - group the components inside a panel (e.g. turn them into tabs)
  - rename the panel headings
  - switch the panel/s off

### a) Configure the Viewer

Locate the `script` section in the `index.template.html` file:

As a rule of thumb, every key with a boolean value (e.g. *true* or *false*) defaults to `true` and denotes to show the appropriate component.

```html
  <script id="emo-config" type="application/json">
  {
    "entrypoint": "https://{server}{/prefix}/{collection}/collection.json",
    "colors": {
      "primary": "",
      "secondary": "grey",
      "accent": "darkred"
    },
    "headers": {
      "all": true,
      "info": true,
      "navigation": true,
      "toggle": true
    },
    "labels": {
      "item": "Sheet",
      "manifest": "Manuscript"
    },
    "meta": {
      "collection": {
        "all": true,
        "collector": true,
        "description": true,
        "title": true
      },
      "manifest": {
        "all": true,
        "creation": true,
        "editor": true,
        "label": true,
        "location": true,
        "origin": true
      },
      "item": {
        "all": true,
        "label": true,
        "language": true
      }
    },
    "standalone": true
  }
</script>
```

**Note**:

It's a *JSON* object. So if you are going to make any changes and you have to quote these (see *labels* or colors), please use *double quotes* only.

#### The Keys in Detail

- **entrypoint**

  to link the viewer to a backend, the entrypoint should point to the collection you want to be displayed.
  (Further details below: [Connecting the Viewer to a Backend](#connecting-the-viewer-to-a-backend))

  **Note**:

  You have to provide at least a valid entrypoint (see below). Otherwise the Viewer won't show anything at all!

- **colors**

  Set the colors used in the frontend.

  `primary` and `accent` should be a darker tone, so that white text is visible if used as background. It's the other way around with `secondary`.

  Hex values (like `#a1a1a1`) or color names (like `hotpink`) are fine.

  If any value is left blank (e.g. `"primary": "",`), a default color scheme will be used.

- **headers**

  - **all**

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

    **Note**:

    if you turn this one off, you won't be able to toggle the panels anymore.

    All header values default to `true`.

- **labels**

  - **item**:

    The label of the item respectively  
    Assuming your collection consists of letters, you'd maybe want to name it "letter" or just "sheet" for instance.  
    This change affects the captions of the navbuttons located in the headerbar and the metadata section.  
    Defaults to `Sheet`.

  - **manifest**:

    Same as for `item` but related to the manifest title.  
    Defaults to `Manuscript`.

- **meta**

  set either of the values to `false` to switch it off. if you set an `all`-key to `false` the other fields within the same object aren't taken into account.

  e.g. neither of *collector*, *description* and *title* will be displayed:

  ```json
  "meta": {
    "collection": {
      "all": false,
      "collector": true,
      "description": true,
      "title": true
    }
  }
  ```

- **standalone**

  denotes if the Viewer will be used as a single page application or if it will be embedded into an existing page. If you want to use it in the latter case, please toggle the value to "false". That way the language toggle in the footer section will not show up.

  Defaults to `true`.

### b) Configure the Panels

In order to configure the panels, locate the `panels.js` file inside the `src/config` folder of your project dir and find the *panels* constant at the top of the file:

```js
  const panels = [
    {
      id: uuidv4(),
      connector: [1, 2],
      panel_label: 'Tabs',
      show: true,
    },
    {
      id: uuidv4(),
      connector: [3],
      panel_label: 'Image',
      show: true,
    },
    {
      id: uuidv4(),
      connector: [4],
      panel_label: 'Text',
      show: true,
    },
    {
      id: uuidv4(),
      connector: [5],
      panel_label: 'Annotations',
      show: true,
    },
  ];
```

It consists of four objects according to the maximum number of panels, that can be shown at once.  
Each object inside that constant consists of similar keys: `id`, `connector`, `pane_label` and `show`.

#### The Panel Keys in Detail

- **id**

  provides unique IDs. (**Note**: please leave this value untouched; it's meant for internal use only!)

- **connector**

  references the component id/s according to the appropriate panel/s or rather tab/s:

  - 1 = Treeview
  - 2 = Metadata
  - 3 = OpenSeadragon
  - 4 = Content / Text
  - 5 = Annotations

  **Note**:

  These IDs are supposed to be *unique*, so please make sure not to repeat these!

- **panel_label**

  refers to the heading in each panel's *toolbar* (**Note**: Please make sure to also change the name, if you are going to reorder the panels or turn them into tabs.)

- **show**

  toggles (`show` or rather `hide`) the appropriate panel respectively

**Note**:

Modifying the *connector* and the *panel_label* works on user configuration as well.

Example given:

Assuming you want to combine the *Metadata*, *Text* and *Annotations* panels:

```js
  {
    id: uuidv4(),
    connector: [2, 4, 5],
    panel_label: 'Meta, Text & Anno',
    show: true
  }
```

To rename a panel heading, change the corresponding `panel_label` according to your needs.  
If you intend to hide a component, just toggle its corresponding *show-key* to `false`.

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

![Architecture diagram of the EMo viewer](img/emo_architecture.png)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/tags).

## Authors

See the list of [contributors](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/graphs/develop) who participated in this project.
