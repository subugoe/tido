# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
