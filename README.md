# EMo Viewer

Viewer for the modular framework to present digital editions.

**Note:**
Although the EMo Viewer is designed as a generic viewer for digital editions, it is currently developed within the scope of the [Ahiqar project](https://gitlab.gwdg.de/subugoe/ahiqar).
This is the reason for "Ahiqar" being mentioned several times in the docs of this repo.

Demo: <https://subugoe.pages.gwdg.de/emo/Qviewer/develop>

(For newer branches the demo is deployed in a directory named with branch name lowercased, shortened to 63 bytes, and with everything except `0-9` and `a-z` replaced with `-` (CI_COMMIT_REF_SLUG).
Also the commit short hash can be used to see a demo.

**Overview:**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Viewer components](#viewer-components)
- [Latest version](#latest-version)
- [Integration](#integration)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Set up `nvm` and the recent stable version of `node.js`](#set-up-nvm-and-the-recent-stable-version-of-nodejs)
    - [Set up `global` project requirements via `npm`](#set-up-global-project-requirements-via-npm)
    - [Clone the repository](#clone-the-repository)
    - [Get the dependencies](#get-the-dependencies)
- [Usage](#usage)
  - [Start the Viewer in `development` mode (hot reloading, error reporting, etc.)](#start-the-viewer-in-development-mode-hot-reloading-error-reporting-etc)
    - [`Lint` the files](#lint-the-files)
    - [`Build` the app for production](#build-the-app-for-production)
- [Customize the Configuration](#customize-the-configuration)
- [Configure the Viewer](#configure-the-viewer)
  - [The keys in detail](#the-keys-in-detail)
- [Dockerfile](#dockerfile)
- [Connecting the Viewer to a Backend](#connecting-the-viewer-to-a-backend)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Viewer components
![Viewer components](img/Viewer.png)

## Latest version
To embed the viewer for production, the latest compiled and minified version is
available at: https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/jobs/artifacts/develop/download?job=build

## Integration
To include the viewer on a website add the following to your `index.html` file:

```html
<noscript>
  <strong>We're sorry but TextViewer doesn't work properly without JavaScript enabled.
  	Please enable it to continue.
  </strong>
</noscript>

<script id="emo-config" type="application/json">
  {
	...
  }
</script>

<div id=q-app></div>

<script src=js/app.[CHECKSUM].js></script>
<script src=js/runtime.[CHECKSUM].js></script>
<script src=js/vendor.[CHECKSUM].js></script>

```

and replace `[CHECKSUM]` with the values from the release you are going to use.

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
Besides it also keeps track of resolving permission issues,
since all your global installations go to your home directory (~/.nvm/) instead of being applied systemwide.

### Installation

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
  git clone git@gitlab.gwdg.de:subugoe/emo/viewer.git
  ```

#### Get the dependencies

Head over to your project directory, where you just cloned the repository to as described above and get all the dependencies needed by simply typing:

  ```bash
  cd /path/to/projectdir
  npm install
  ```

That's it. You should now be able to run the Viewer.

## Usage

### Start the Viewer in `development` mode (hot reloading, error reporting, etc.)

```bash
npm run dev
```
(usually located at: `localhost:8080`)

#### `Lint` the files

```bash
npm run lint
```

#### `Build` the app for production

```bash
npm run build
```

**Note**: The complete build is located at /dist/spa/.

## Customize the Configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Configure the Viewer

Locate the `index.template.html` file inside the root of your project dir and find the script section:

**Note**:

It's a json object. So if you are going to make any changes and you have to quote these, use double quotes but single ones.

```html
  <script id="emo-config" type="application/json">
    {
      "entrypoint": "https://{server}{/prefix}/{collection}/collection.json",
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
      "standalone": true
    }
  </script>
```

## Configure Panels

In order to configure the panels, locate the `panels.js` file inside the `src/components/config` of your project dir and find the panels section:

**Note**:

As a rule of thumb, every key with a boolean value (e.g. *true* or *false*) defaults to `true` and denotes to show the appropriate component. If you intend to hide a component, just toggle it's corresponding key-value to `false`.

It's an array structure. So if you are going to make any changes and you have to quote these, use double quotes but single ones.

```html
  const panels = [
    {
      id: uuidv4(),
      connector: [1, 2],
      panel_label: 'Tabs',
      show: true,
      tab_model: null,
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
### The keys in detail

- **entrypoint**

	to link the viewer to a backend, the entrypoint should point to the collection you want to be displayed.<br />
	(Further details below: [Connecting the Viewer to a Backend](#connecting-the-viewer-to-a-backend))

	**Note**: You have to provide at least a valid entrypoint (see above). Otherwise the Viewer won't show anything at all!

- **headers**

  - **all**<br />
    set this value to `false` if you want to completely switch off all the headerbars at once.<br />
    This value takes precedence over the other *header-keys*.<br />
    If it's set to *false*, the other settings for the individual bars are not taken into account.<br />
    *(A use case might be to embed the Viewer into an existing website and you simply need more screen space)*

  - **info**<br />
    set this value to `false` if you want to switch off the Infobar (a.k.a. breadcrumbs)
  - **navigation**<br />
    set this value to `false` if you want to switch off the NavBar
  - **toggle**<br />
    set this value to `false` if you want to switch off the ToggleBar.

    **Note**: if you turn this one off, you won't be able to toggle the panels anymore.

    All header values default to `true`

- **labels**

  - **item**:<br />
    the label of the item respectively

    Assuming your collection consists of letters, you'd maybe want to name it "letter" or just "sheet" for instance.<br />
    This change affects the captions of the navbuttons located in the headerbar and the metadata section.

    Defaults to `Sheet`

  - **manifest**:<br />
    same as for `item` but related to the manifest title<br />

    Defaults to `Manuscript`

- **standalone**

	denotes if the Viewer will be used as a single page application on it's own or if it will be embedded into an existing page. If you want to use it in the latter case, please toggle the value to "false". That way the language toggle in the footer section will not show up.

	Defaults to **true**

- **Panels Configure**

  - **panels**

	It's keys correspond to the panelnames, e.g. "contents", "text", "image" and so on.
  <br />
  **Note:** Pls **leave these keys UNTOUCHED** since these are for internal use only!
  <br /><br />
	Each object inside panels consists of keys: `id`, `connector`, `pane_label`, `show` and `tab_model`.
  	Change either panel_label-key according to your liking and set either show-key to **false** if you don't want the Viewer to show the appropriate panel/s.

  	Example given:

    ```json
    {
      panels: [
        {
          id: uuidv4(),
          connector: [1, 2],
          panel_label: 'Tabs',
          show: true,
          tab_model: null,
        },
      ]
    }
    ```

  - **id** Provides unique id always instead of hard coded id's.
  - **connector** Groups together the panels as tabs (works on user configure as well).
  - **panel_label** Refers to the caption in each panel's toolbar
  - **show** toggles (show or rather hide) the appropriate panel respectively.
  - **tab_model** Represents to displays panels in a tab when loading for the first time.

## Dockerfile

The dockerfile is used at GitLab CI.
It needs to be updated, when either node or quasar-cli should be updated.

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
