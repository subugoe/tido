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
  - [Translations](#translations)
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
        "collection": "https://textapi.dev.vierwachen.sub.uni-goettingen.de/api/4w/reproduction/collection.json",
        "manifestIndex": 0
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

| Name                                 | Type                                  | Default   | Description                                                                                                                                                                                                                             |
|--------------------------------------|---------------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| allowNewCollections                  | Boolean                               | true      | Toggles the ability to add new collections to the app through a user input.                                                                                                                                                             |
| container                            | String                                | `#app`    | Specifies the CSS selector where we should append the TIDO app to.                                                                                                                                                                      |
| defaultPanelMode                     | `pip` \| `split` \| `text` \| `image` | `pip`     | Specifies the default view type of all panels. Each new panel will start with view.                                                                                                                                                     |
| lang                                 | String (ISO 639-1 language code)      | `en`      | Specifies the current active language of the app. See [translations](#translations) chapter.                                                                                                                                            |
| panelModes                           | Array                                 | ['swap', 'split', 'text', 'image']          | Controls the display and order of panel mode toggles in the top right of a panel. At least 1 value is required. If not specified at all, TIDO will use the default value and try to display reasonable toggles and disable unused ones. |
| panels                               | PanelConfig[]                         | []        | Defines an array of panel objects. The panels will appear in the same order.                                                                                                                                                            |
| panels[i].collection                 | String                                | -         | TextAPI collection URL                                                                                                                                                                                                                  |
| panels[i].manifestIndex              | Number                                | 0         | Index of a manifest object inside the sequence of a TextAPI collection specified under "collection".                                                                                                                                    |
| panels[i].itemIndex                  | Number                                | 0         | Index of an item object inside the sequence of a TextAPI manifest specified as index under "manifestIndex".                                                                                                                             |
| rootCollections                      | String[]                              | []        | Specifies a list of TextAPI collection URLs that appear in the global tree on the left. Users navigate and open new panels from those collections.                                                                                      |
| showGlobalTree                       | Boolean                               | true      | Toggles the display of the global tree on the left. When false the toggle button in the header is hidden.                                                                                                                               |
| showAddNewPanelButlton               | Boolean                               | true      | Toggles the display of the "add new panel" button.                                                                                                                                                                                      |
| theme                                | Object                                | Object    | Specifies theme settings for UI elements.                                                                                                                                                                                               |
| theme.primaryColor                   | String                                | `#3456aa` | Primary color of UI elements. Used on buttons and other interactive elements.                                                                                                                                                           |
| title                                | String                                | empty     | Specifies the main title of the app in the header. Translatable.                                                                                                                                                                        |
| translations                         | Object                                | null      | Specifies a custom translations object. See [translations](#translations) chapter.                                                                                                                                                      |
| translations.[lang]                  | Object                                | null      | Defines a translation object for supported languages with the respective `lang` key.                                                                                                                                                    |
| translations.[lang].[translationKey] | String                                | null      | Defines a translation key/value pair for a supported language. You can override existing key/value pairs or define custom key/value pairs. There is a [list](#translations) that we expose for overriding in the configuration.         |

### Translations
We provide a flexible way to use TIDO in your desired language. First of all we keep all translation keys in files
under `public/translations`. Each file has to follow the naming convention `[ISO 639-1 language code].json`. By default,
we provide a limited amount of supported languages. However, you can configure your custom languages though the TIDO config object.
Append your language under the `translations` key in the config and set the `lang` key to your language so it is treated
as active language.

Hint: There is a difference between fixed keys that we use internally (like `add_new_panel`) or dynamic keys that we might
receive from the TextAPI (like dynamic metadata keys). If you want to translate the latter ones, just state them as keys to your translation object.
Example:

```json
{
  "lang": "fr",
  "translations": {
    "fr": {
      "add_new_panel": "Ajouter un nouveau panneau",
      "title": "Titre",
      "my_custom_key": "Valeur très importante",
      "That one string": "Ce texte"
    }
  }
}
```
You can see that the first two keys `add_new_panel` and `title` are our fixed app keys and the other two keys are custom
project keys. If you set `lang` to a language that we don't support and omit certain translations in your config,
we will display those in English. If you don't provide a translation for a custom key, it will be displayed just as-is.

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
