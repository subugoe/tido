# Emo Viewer (viewer)

Viewer for the modular framework to present digital editions.

Demo: https://subugoe.pages.gwdg.de/emo/Qviewer/develop

(for newer branches the demo is deployed in a directory named with branch name lowercased, shortened to 63 bytes, and with everything except `0-9` and `a-z` replaced with `-` (CI_COMMIT_REF_SLUG). Also the commit short hash can be used to see a demo.

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


## Authors

See the list of [contributors](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/graphs/develop) who participated in this project.

## Dockerfile
The dockerfile is used at GitLab CI. It needs to be updated, when either node or quasar-cli should be updated.
```
docker build --pull -t docker.gitlab.gwdg.de/subugoe/emo/qviewer/node . 
docker push docker.gitlab.gwdg.de/subugoe/emo/qviewer/node
```
