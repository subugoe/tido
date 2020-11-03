# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
