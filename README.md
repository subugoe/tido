# EMo Viewer

Viewer for the modular framework to present digital editions.

**Note:**
Although the EMo Viewer is designed as a generic viewer for digital editions, it is currently developed within the scope of the [Ahiqar project](https://gitlab.gwdg.de/subugoe/ahiqar).
This is the reason for "Ahiqar" being mentioned several times in the docs of this repo.

Demo: <https://subugoe.pages.gwdg.de/emo/Qviewer/develop>

(For newer branches the demo is deployed in a directory named with branch name lowercased, shortened to 63 bytes, and with everything except `0-9` and `a-z` replaced with `-` (CI_COMMIT_REF_SLUG).
Also the commit short hash can be used to see a demo.

## Getting Started

### Prerequisites

To get the EMo Viewer up and running you should have the following software installed:

* npm
* vue-cli (globally installed)
* vue-cli-service-global (globally installed)

For using the development mode you also need

* quasar-cli (globally installed)

To get all dependencies via `npm`, simply run

```bash
npm install -g @vue/cli @vue/cli-service-global @quasar/cli
```

### Installing

### Get the Dependencies

```bash
npm install
```

### Start the App in Development Mode (Hot-Code Reloading, Error Reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
npm run lint
```

### Build the App for Production

```bash
quasar build
```

### Customize the Configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Dockerfile

The dockerfile is used at GitLab CI.
It needs to be updated, when either node or quasar-cli should be updated.

```bash
docker build --pull -t docker.gitlab.gwdg.de/subugoe/emo/qviewer/node .
docker push docker.gitlab.gwdg.de/subugoe/emo/qviewer/node
```

## Connecting the Viewer with a Backend

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
