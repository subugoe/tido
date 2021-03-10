# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.6.0...v1.7.0) (2021-03-10)


### Features

* adjust content type/s according to the recently introduced content key from the API ([5c946fc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/5c946fce6d9486e009441f11089aa138c12c1e3a))
* filter contenturls according to a matching mime-type "application/xhtml+xml" and "text/html" ([ffcb7ce](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ffcb7ce5196098952328e3b213a0a0db875bd0e8))
* implemented Tido to add css styles from Ahikar ([a46ac66](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a46ac6680116ac76bc98a7f4742dd32fb5cbb3c4))


### Bug Fixes

* refactor logic to fix subject array list ([9d2c5c3](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9d2c5c31ee45680a95baa509ca3aaab9d8b03d8e))
* warning bug related to stylesheet from support obj ([a592b9b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a592b9b23ecc5107343c019ed7adfa0c1278beb9))


### Chore

* add basic unit test. to be expanded ([418c6ba](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/418c6ba95c5701b7cb3b1c18236bcf0b8f8dc217))
* adjust unit test according to the change of the datatype ([9be7de2](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9be7de257e671d934c7add46305d8e5136af7ff3))
* remove entrypoint ([03f95f0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/03f95f0319e91a752f020dec0cba331ae2480a71))
* remove log stmt ([2cfde38](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/2cfde380b2559894b5201c760a94f2c8cbf2871f))
* remove obsolete property "language" ([9313da5](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9313da5549c8a3650981a971e16128aec6638030))


### Refactoring

* refactor support logic according to review comments ([73c04c9](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/73c04c971d972ca78bf6394c4d321755161ff59c))

## [1.6.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.5.0...v1.6.0) (2021-02-23)


### Features

* provide and render metadata object according to API specs ([c93ed76](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/c93ed76044e07bafba7cccbbae67318e3062e3af))
* provide data structure with mandatory and optional fields for all meta levels to keep the markup lean ([29edf1b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/29edf1b5742f00ebfd31aecbb02c5c7f866f2c31))
* provide mixin refelcting mandatory metadata according to the specs given ([b328c87](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b328c877697104b49d2285d7a5da7c80046bec44))


### Bug Fixes

* license for the text part; remove comment from the metadata and rename TiDO to TIDO according to review ([375aa9c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/375aa9c791e5d9b3c18e13ae908c858858f5e909))
* remove all obsolete config options regarding the metadata due to refactoring. we didn't agree on what to configure yet. ([57f3e6a](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/57f3e6a1e6909762ea69d1e1531060fe99c3798b))
* remove colon and entrypoint ([d7c05ee](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/d7c05eed2a37ecfb4238c9fbdfc96f80afb9f0f2))


### Chore

* debug & prepare data for matching ([636bc78](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/636bc7818f3827eeee55a478f5a1fb3d9e7a70cf))
* rename core component to TiDO ([4381ade](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4381ade9ca3148017135a43b042394cad02e9660))

## [1.5.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.0.0...v1.5.0) (2021-01-28)


### Features

* ability to write a changelog ([3a42097](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3a42097f18165ece0f9f263a77c5ca5a67db1572))
* enable project specific text styling ([ae7202e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ae7202e4905eccd78071067e54683e0f8a22b391))
* refactored sytles of toggle bar. ([28f3a04](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/28f3a04c7d6097c88845d640eadbc43105169b1f))
* reference correct repo URLs ([6e0477c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/6e0477cd7d80599d3fbd114451126edb6c5c3536))
* release our viewer via npm ([861d3d0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/861d3d067df7b1c3c128d995383b63c0a081c80b))
* release: resolve conflicts and merge develop into main ([74b7247](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/74b72473c978129b8166e7b24250dd04eb235585))
* trigger update on downstream project ([0f048fb](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0f048fb63c9eaa87932b7e1bb0e20c632570148e))
* update Ahiqar repo name ([4d3445b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4d3445b55ada2fc686dd5ab4043cde132e4709fe)), closes [#115](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/115)


### Bug Fixes

* add missing package.json.lock ([821d180](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/821d1804392c60199cbacc0630a5548a5f77742b))
* Addressing review comments and a11y. ([d3a7c5d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/d3a7c5d3d993c876e256d31a9f1eb9544d33c89e))
* display meta items only if provided by the api ([ab15468](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ab154687df711aa1ffb6306cb454832cfec430c1))
* fix displaying of single manifest ([d71c467](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/d71c467c1baa5a34abd5aa10054fa0a5fc6c81ad))
* fixed the bug regarding metadata and refactored OSD stylings. ([41f6c06](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/41f6c06a71d107314eaad8af7bae1afea3f93b12))
* Fixed toggle buttons disappear, anchoring manifest title to top. ([928be0d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/928be0da657890c85ec17b7d2f950dcf66c72c4c))
* gitlab CI syntax ([10fb37e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/10fb37e75a00875880bac80fa37e58c9db425a9e))
* make css classname understandable ([ce1ea7f](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ce1ea7f053cc4efabc7c427773a9bc18b3766406))
* patch the entrypoint for the Ahikar demo / dev branch ([b0fe3db](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b0fe3db7d37426b1cc900ead319e500fd6cfb775))
* Quasar's helper setBrand requires two strings as parameters, hence we should leave the config object with an empty string to disable it ([bc34791](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/bc3479143053d58a9570b75e0827d74ddd8bde01))
* remove obsolete css class and fix code hint from json to js in the README ([8752731](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/875273183dbe898795ed90cc9175e2cbea22b356))
* run npm run fix with pre commit hook ([58f6453](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/58f6453c727c6f84af7d742d9b771a95109845ce))
* upload missing file ([6b89854](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/6b89854acfb314af0a1ceb3973aa63d41ca79cfc))
* upload missing script ([e9f755b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e9f755b2a725d98982fad2ab393ac692c34843e0))


### Docs

* add (S)CSS coding guidelines ([e47485b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e47485b81c650b5084f5692893c7885560e68b56))
* rewrite connector config; refactor: eslint-disable-next-line; switch back to test server (index.html) ([74b8f52](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/74b8f522e3f395efc710fac2a1041854adcce9f3))
* update CONTRIBUTING.md with notes about the usage of husky and commitizen ([9c19ddb](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9c19ddb9d05c709f2c3e4b829037f60529ea764d))


### Refactoring

* addressed fixme comments. ([fd1f696](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/fd1f696f50ea97584f8c82dcb5da3022a3127839))
* deactivated customize buttom from toggle bar. ([6473034](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/64730348fc0a28d6a2fd3b709e53a40047920bf6))
* moved tree scoped style to new file. ([15734cc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/15734cc9c6107d74f1c0aed9c8cf26583dc63b76))
* npm run lint and fix scripts ([c956e32](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/c956e329a192c1e2c3060c15bd7f01994cb18948))


### Build System

* add pre commit hook for linting, fixing and testing ([b4d756d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b4d756de677831d0d48158af63242457bcd1bdd6))
* improve styleint rules ([bd573a7](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/bd573a7beed69901049b86cab307f2b860609829))


### Continuos Integration

* add .gitlab-ci.yml ([e7dd59d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e7dd59d8c3fd80b18e29f87346befdb8fc7a0fb2))
* change branch which triggers ahiqar-tido update ([e03333c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e03333c9942458544d5d7d2f50575d309de6baba))
* fix typo ([7de35dd](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7de35dde1533f19fd9593f66121f73f66e569b08))
* keep main and develop artifacts ([c8f65e4](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/c8f65e473c30fc7ee5a2288b050b0495c4348fa3)), closes [#55](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/55)


### Chore

* add stmt to CHANGELOG ([d679512](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/d679512f008b1e681810dd7ac56b76302f4295e9))
* remove unnecessary passages from GitLab templates, add passage concerning README ([f75c118](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/f75c118aedf02000ae6a09988e9f0f1ae3f58476))
* revert icon state and adjust quasar.conf according to new product name ([71145a0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/71145a07741ff6a5b6aa777dd7892cce168854c5))

## [1.4.5] - 2020-11-02

### Fixed

- remove collection check in mainView to keep single manifests displayed as well.

## [1.4.4] - 2020-11-02

### Added

- Update downstream projects via CI pipeline trigger.

## [1.4.3] - 2020-10-05

### Added

- New local store for tree component.

### Fixed

- re-rendering of components when drag and drop on dialog modal.

## [1.4.2] - 2020-10-01

### Added

- .nvmrc containing node version

### Fixed

- quoting in css/responsive-heights.scss

## [1.4.1] - 2020-09-29

### Added

- Add config for unit tests via jest. testfiles goto *tests/unit/specs/*test.js*

### Changed

- delete tab-folder with components. provided a computed prop to wait for conditional changes

## [1.4.0] - 2020-09-11

### Added

- Refactored drag and drop component in order to make it user configurable.
- Moved panel data structure into a separate component where panels can be configured.

## [1.3.3] - 2020-09-10

### Changed

- GitLab templates have been tidied up.
Also a passage explicitly mentioning the README has been added to them (where applicable).

## [1.3.2] - 2020-09-02

### Added

- additional metadata on manifestlevel. e.g. `date`, `editor`, `origin`, `location`

## [1.3.1] - 2020-08-28

### Fixed

- the CI artifacts created on the `develop` and `main` branch are no longer automatically removed
after 30 days.

## [1.3.0] - 2020-08-24

### Added

- Refactored mainview template. Components are dynamic now and the order is configurable
- New button to the toggle bar so that user can able to configure order of the panels dynamically.
- created a new re-usable component to drag and drop panels.

### Changed

- refactored toggleIndex component.

## [1.2.1] - 2020-08-12

### Changed

- refactored toggleBar to toggleIndex / toggleFilter according to window size. toggle switches at 1100px

## [1.2.0] - 2020-08-03

### Changed

- The logic of using splitters for mainview is removed and made use of Grid in order to make viewer responsive.

### Added

- Moved toggle buttons from the header into a dropdown menu items.

## [1.1.1] - 2020-08-03

### Fixed

- fix tree bug if meta panel is active. implement listener for active panel tab

## [1.1.0] - 2020-07-29

### Added

- metadata panel exchanged by annotation panel (no content yet). therefore metadata goes into the tree panel.
both of the latter became tabs inside this one panel.
- panel order changed to: contents / metadata (tabs), image, text, annotations

## [1.0.1]- 2020-07-30

### Changed

- The content of the development branch is no longer purged from the artifacts, even if the branch hasn't been updated for 14 days.
This way we ensure that <https://subugoe.pages.gwdg.de/emo/Qviewer/develop/#/> always works.

## [1.0.0] - 2020-07-27

### Added

- Preparation for EMo Viewer initial release v1.0.0

## [0.1.0] - 2020-07-24

### Fixed

- bug in navigation: itemindex was updated too late; lacking the corresponding sequenceindex. passed the latter to listener

## [0.0.24] - 2020-07-22

### Added

- license AGPL v3.0
- NOTICE
- license info in softwareinfo

### Changed

- README.md completed (added diagram of Viewer's components, changes config description, updated toc with doctoc)
- extended package.json

## [0.0.23] - 2020-07-20

### Added

- hide image toggle and panel if no imageurl is provided
- panelnames are configurable. togglenames and captions are updated accordingly

### Fixed

- order of toggles corresponds to panels

## [0.0.22] - 2020-07-13

### Added

- Refactored logic to keep focus on selected item in the tree view.

## [0.0.21] - 2020-07-13

### Fixed

- Refactored height stylings according to resolution size of the window.

## [0.0.20] - 2020-07-10

### Changed

- The page deployment now takes places without having to store any data externally.
We only rely on previous artifacts for new pipelines.

## [0.0.19] - 2020-07-03

### Added

- replace basic page / sheet counter by *original* pagelabel delivered by the api.

## [0.0.18] - 2020-07-02

### Fixed

- TreeView: expanded-stack. switched from pop() to splice(). pop() broke the stack, since it deals with the stack tail
- TreeView: root node (collection title) is expandable / collapsible now as well

## [0.0.17] - 2020-07-01

### Fixed

- TreeView: according to the Quasar maintainer, q-tree doesn't provide a possibility to have nodes selected and expanded in the same step. it behaves so by design!
  So: provided a handler function to fake this very behaviour. Manifest titles now toggle on click (expand / collapse) without being selected.
- Actual Item is now selected at Viewer start (init)
- expanded-stack grew by clicking an item (same title has been pushed onto the array/stack over and over again). this is now handled by comparing the appropriate sequence-index.

## [0.0.16] - 2020-06-25

### Added

- Configured to anchor manifest title to top of the panel.

## [0.0.15] - 2020-06-24

### Fixed

- Reverted the changes and fixed the icons to nest inside image.

## [0.0.14] - 2020-06-23

### Added

- filter function to the tree: now able to filter by labels, e.g. 122v

### Changed

- delete obsolete code sections
- fix indents for better readability
- extend the README file in regards to front-end setup
- delete quasar's `selected`-prop used for the *q-tree*-component to disable the selection of manifest titles
- rename var `pagelabel` to `ìtemlabel` which seems to be more descriptive

- remove artifacts from blob that are older than 2 weeks.
this generally speeds up the build process and prevents errors since GitLab can only handle artifacts up to a certain size.
- Configured to anchor manifest title to top of the panel.

## [0.0.13] - 2020-06-22

### Added

- Added behaviour to Optimize scroll panels.
- Fixed panel icons to top of the panel.

### Fixed

- item is now highlighted when the user clicks a nav-button
- click events are bound for the zoom icons are now bound to the embracing buttons instead of the icons

## [0.0.12] - 2020-06-19

### Added

- config option (index.html): switch off the header bars individually (e.g. Infobar, NavBar, ToggleBar)

### Changed

- default itemlabel from `Page` to `Sheet`
- config options: labels for item and manifest are gathered under `labels`
- header can also be switched off completely by setting the appropriate value to *false*

### Fixed

- items are highlighted consecutively when browsing by navbuttons

## [0.0.11] - 2020-06-17

### Added

- config option (index.html): switch off the header including all of it's components

## [0.0.10] - 2020-06-16

### Added

- config option (index.html): tell the viewer with which panels to start

## [0.0.9] - 2020-06-16

### Added

- an architecture diagram giving an overview of how the EMo Viewer works and interacts with a back-end.

## [0.0.8] - 2020-06-12

### Added

- information in the README on how to configure the Viewer

## [0.0.7] - 2020-06-09

### Added

- information in the README on how to establish a link between the Viewer and a back-end.
- missing general README section about contributing and versioning.

## [0.0.6] - 2020-05-29

### Changes

- add user stories and 'definition of done' criteria to issue templates (where applicable).
this should improve the development workflow for all stakeholders.

## [0.0.5] - 2020-05-20

### Added

- add a contribution guideline
- added titles in the footer for Language- and Info-icon

### Changed

- make README more comprehensible for outsiders

### Fixed

- icons side by side via css float

## [0.0.4] - 2020-05-19

### Added

- Text can now be zoomed in and out to a max of 32px and min of 8px. The font size defaults to 14px. It is tracked during browsing.
- Software info includes links to documentation, source code and bug reporting

## [0.0.3] - 2020-05-18

### Added

- extended config object in index.html by a key named "standalone" (Possible values: true || false).
This indicates if the viewer will be used embedded or standalone respectively.
If used in the latter case, the language toggle shows up in the footer and vice versa.

## [0.0.2] - 2020-05-15

### Added

- openseadragon.vue: Event listener for fullscreen change

### Changed

- toggle fs icon on fullscreen change

## [0.0.1] - 2020-05-14

### Added

- This CHANGELOG file

### Added

- Pages deployment on per commit and per branch base
