# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.6] - 2020-06-09

### Added

- information in the README on how to establish a link between the Viewer and a backend.
- missing general README section about contributing and versioning.

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

- Text can now be zoomed in and out to a max of 32px and min of 8px. The fontsize defaults to 14px. It is tracked during browsing.
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
