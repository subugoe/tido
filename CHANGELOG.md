# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.9.0](https://github.com/subugoe/tido/compare/v4.8.9...v4.9.0) (2025-09-24)


### Features

* add image overlay annotations ([9f51397](https://github.com/subugoe/tido/commit/9f51397cfbe811ea438e2084b5e5f5ae6a371de2))

### [4.8.9](https://github.com/subugoe/tido/compare/v4.8.8...v4.8.9) (2025-09-24)


### Bug Fixes

* show correct error message when no content type was found for configured text view ([06449aa](https://github.com/subugoe/tido/commit/06449aa56483b8dc13eda1b9bc87e102b6d960fe))

### [4.8.8](https://github.com/subugoe/tido/compare/v4.8.7...v4.8.8) (2025-08-29)


### Bug Fixes

* update the "show" bookmark for hidden panels only when url config was present ([72fa345](https://github.com/subugoe/tido/commit/72fa3451b1c8cd632058dd93c59c24a011369061))

### [4.8.7](https://github.com/subugoe/tido/compare/v4.8.6...v4.8.7) (2025-08-14)


### Bug Fixes

* set "show" bookmark when any panel is hidden by custom config to avoid inconsistency in the bookmarking ([0529a32](https://github.com/subugoe/tido/commit/0529a3213971078d9f3409566d9509af54c7fec7))

### [4.8.6](https://github.com/subugoe/tido/compare/v4.8.5...v4.8.6) (2025-07-15)


### Bug Fixes

* reset button sets panel toggles to pre-configured state ([171704c](https://github.com/subugoe/tido/commit/171704c85276cda1a0e3f6a44b0dad40c4ce7b79))

### [4.8.5](https://github.com/subugoe/tido/compare/v4.8.4...v4.8.5) (2025-07-10)


### Bug Fixes

* avoid registering text click listeners multiple times ([f0df3d4](https://github.com/subugoe/tido/commit/f0df3d48c873310259fcb5b80d1a89e8d7fde031))

### [4.8.4](https://github.com/subugoe/tido/compare/v4.8.3...v4.8.4) (2025-07-08)


### Bug Fixes

* apply show setting from custom config for each panel ([7ad27b3](https://github.com/subugoe/tido/commit/7ad27b3db0f5c8a450a72fc50adf98c52e1b0fb6))

### [4.8.3](https://github.com/subugoe/tido/compare/v4.8.2...v4.8.3) (2025-06-19)


### Bug Fixes

* fix still broken highlighting behaviour for multiple text panels ([2ada943](https://github.com/subugoe/tido/commit/2ada9438e9ac7da602b1fe5b69776352fb540dbb))

### [4.8.2](https://github.com/subugoe/tido/compare/v4.8.1...v4.8.2) (2025-06-19)


### Bug Fixes

* add "last loaded" variables to annotation view to keep track of new annotations more precisely ([39cd2eb](https://github.com/subugoe/tido/commit/39cd2eb9458691bb63fb055c8a0b998908e98818))
* annotations usage for more than one configured text panels ([b90e767](https://github.com/subugoe/tido/commit/b90e767aabcc4fda1af90ec96dd852125d175dae))

### [4.8.1](https://github.com/subugoe/tido/compare/v4.8.0...v4.8.1) (2025-03-28)


### Bug Fixes

* display annotations when no refs are given ([91613d8](https://github.com/subugoe/tido/commit/91613d840be5646841731490d745449ef1deb38a))

## [4.8.0](https://github.com/subugoe/tido/compare/v4.7.0...v4.8.0) (2025-03-20)


### Features

* add an option in config to have no icons for annotations ([af10dc3](https://github.com/subugoe/tido/commit/af10dc312190aab5bfd30b28ad16812a2e0c0503))
* display siglums in variant items and show witness titles on hover ([71f460a](https://github.com/subugoe/tido/commit/71f460a4010fdcfd9b122513f4ec4f6a230c5f7f))
* use witness idnoAlt in variant items, witnesses filter and text, show witness titles on hover in varaint items ([0278e8b](https://github.com/subugoe/tido/commit/0278e8b55f537c61bdc507a34701861d8279efb4))


### Bug Fixes

* deselecting varaint items in text ([8dfcd6e](https://github.com/subugoe/tido/commit/8dfcd6ef689fb80595aee0dd85ddef6a09c4290a))


### Docs

* update README.md ([0c3aa93](https://github.com/subugoe/tido/commit/0c3aa938ba825f88079f56a222f1f64f35e61968))

## [4.7.0](https://github.com/subugoe/tido/compare/v4.6.0...v4.7.0) (2025-03-03)


### Features

* add "fitPanels" config option, control panel widths with flex values ([#572](https://github.com/subugoe/tido/issues/572)) ([6ac19f5](https://github.com/subugoe/tido/commit/6ac19f56a330837e1b629531b845428bc0cfff48))
* remove all surrounding paddings for better embedding ([039b556](https://github.com/subugoe/tido/commit/039b5569e08c6da2d7a5d99b9a7c8094344c65d9))


### Bug Fixes

* fitPanels behaviour on mobile screens ([26a5d79](https://github.com/subugoe/tido/commit/26a5d79bf4d3227ac7532971ff99995043d3a4ec))


### Docs

* add documentation for the feature`flexible ordering of metadata` ([9adc955](https://github.com/subugoe/tido/commit/9adc955a6590ff0c0f6086c4618b4434c02ddcd7))
* add EUPT example ([f711cec](https://github.com/subugoe/tido/commit/f711cecfdf82ef3aefced38328fc0dded5d99e44))
* update config builder ([49ca3a0](https://github.com/subugoe/tido/commit/49ca3a0b670c476264eb2a38b6408abe5720e60c))

## [4.6.0](https://github.com/subugoe/tido/compare/v4.5.2...v4.6.0) (2025-02-14)


### Features

* scroll to annotation item when clicked in text ([e563a3d](https://github.com/subugoe/tido/commit/e563a3d294e3924323c2ec10f73ce1b05702e675))


### Bug Fixes

* display primary color on annotation icons in text ([5f0cca5](https://github.com/subugoe/tido/commit/5f0cca5d8740bcf8cc52a4997700bb73628e2ee0))
* nested metadata display ([#570](https://github.com/subugoe/tido/issues/570)) ([7610196](https://github.com/subugoe/tido/commit/761019635a23d39f31faa715f645a1d0516c19f1))


### Refactoring

* remove unused ([28851c8](https://github.com/subugoe/tido/commit/28851c84ee62c5e79837e03f494be6922c527d02))

### [4.5.2](https://github.com/subugoe/tido/compare/v4.5.1...v4.5.2) (2025-02-10)


### Bug Fixes

* check whether 'translations' object and 'lang' are defined in custom config ([a77b600](https://github.com/subugoe/tido/commit/a77b60018fac93cd4129dbc2ad94f3affd01f2db))


### Docs

* add config builder page to demo ([#564](https://github.com/subugoe/tido/issues/564)) ([5aa9b03](https://github.com/subugoe/tido/commit/5aa9b031961c062a922b850d27c3758de6b2a3fa))
* fix icons grid ([bb42952](https://github.com/subugoe/tido/commit/bb429525c11f36c81073e0cbf8538a325260fb0f))

### [4.5.1](https://github.com/subugoe/tido/compare/v4.5.0...v4.5.1) (2025-02-06)


### Bug Fixes

* add breaking for annotation items ([1939fdc](https://github.com/subugoe/tido/commit/1939fdc5f501f8dbda7789078c748acf532d48c3))
* add scroll to annotation views without tabs ([3a21d66](https://github.com/subugoe/tido/commit/3a21d66042f0ece3d7b54b54284c65f874d549b6))

## [4.5.0](https://github.com/subugoe/tido/compare/v4.4.0...v4.5.0) (2025-01-31)


### Features

* add flexible order of entries in metadata panel ([#551](https://github.com/subugoe/tido/issues/551)) ([527c8d5](https://github.com/subugoe/tido/commit/527c8d51c830edf240f693d3ed99ff3ef55d68ee))
* handle and display multiple witnesses per variant annotation item ([02d2dfe](https://github.com/subugoe/tido/commit/02d2dfe8ec07e7566f99c0a333dee1490507601e))

## [4.4.0](https://github.com/subugoe/tido/compare/v4.3.1...v4.4.0) (2025-01-09)


### Features

* add "width" as config option, panels have now a default width and overflow horizontally, update mobile panel design to be full width ([df4aa17](https://github.com/subugoe/tido/commit/df4aa173aeea1d57ac392b68928e7dfb583e4bc8))
* add a share copy button which copies citation value to clipboard ([#530](https://github.com/subugoe/tido/issues/530)) ([b697eba](https://github.com/subugoe/tido/commit/b697eba327cb0411aae6bbf7f352657dd6ee846c))
* change language display label ([606d148](https://github.com/subugoe/tido/commit/606d148f48317bdc164466e68870ecd9a0c8dc06))


### Bug Fixes

* don't change value of nav button labels when new item has not loaded yet ([34d9e07](https://github.com/subugoe/tido/commit/34d9e074fa7afa2c227c7ee428a01ac9dbfb3e3c))

### [4.3.1](https://github.com/subugoe/tido/compare/v4.3.0...v4.3.1) (2024-11-11)


### Bug Fixes

* truncate and add ellipses for long witnesses ([#520](https://github.com/subugoe/tido/issues/520)) ([55a840c](https://github.com/subugoe/tido/commit/55a840cdebb1ca70656ba343ab946686a39f6cd0))
* update the variants list according to witnesses selection when disabling single select mode ([b9bd8eb](https://github.com/subugoe/tido/commit/b9bd8eb0a93c0138bf064f1cde0a84f37d332861))

## [4.3.0](https://github.com/subugoe/tido/compare/v4.2.0...v4.3.0) (2024-11-06)


### Features

* add info message in Single Select Mode ([#515](https://github.com/subugoe/tido/issues/515)) ([56853bd](https://github.com/subugoe/tido/commit/56853bd0fa5f5a5f35577785e0e5ab37efdf6ed8))


### Bug Fixes

* change the logic of showing the message box in annotations list ([936c1e8](https://github.com/subugoe/tido/commit/936c1e8fe3805cbbda4b332937d0749e2147d18f))
* make the witnesses wrapper with flex-wrap css prop ([26f9ec2](https://github.com/subugoe/tido/commit/26f9ec2d0961ff267cd3eea37906ac6201065423))
* use inline-flex for witnesses wrapper to be in text flow ([272bfa7](https://github.com/subugoe/tido/commit/272bfa73be678e804188cdc1867b17ec2268f1a3))

## [4.2.0](https://github.com/subugoe/tido/compare/v4.1.1...v4.2.0) (2024-10-30)


### Features

* add active variants details popup ([c4b9087](https://github.com/subugoe/tido/commit/c4b9087e8b1cf7958d983aae52c6dcb475dbd475))
* add single select mode ([f337847](https://github.com/subugoe/tido/commit/f337847cf24460dc4c98802484786709c333105f))
* add variant item selection/deselection  ([#459](https://github.com/subugoe/tido/issues/459)) ([031d827](https://github.com/subugoe/tido/commit/031d827e8b811cd060945eeb12f15e6d042429f0))
* add variants top bar to filter by witnesses, refactor all into VariantsView ([a9e99a1](https://github.com/subugoe/tido/commit/a9e99a1c0ddc308e68a5eadded1279af4c5a8d1d))
* display a list of variants objects in a new Variant view  ([671ae74](https://github.com/subugoe/tido/commit/671ae74b46c5b65a70e8bd005013c9495cbdeab5))
* display all targets with their respective variants in variants details popup ([a6b44c6](https://github.com/subugoe/tido/commit/a6b44c614cb6d85f90a38916faa06e00f621e042))
* implement selecting/deselecting an annotated text ([#460](https://github.com/subugoe/tido/issues/460)) ([9c203e3](https://github.com/subugoe/tido/commit/9c203e3936d451732b819133ee0d6bce3856963a))


### Bug Fixes

* add font family for witness chip ([0c59e1e](https://github.com/subugoe/tido/commit/0c59e1e2c7e8ff1dfdf0b709a0facc10c6580902))
* allocate witness colours after annotations are loaded for each item + add a test ([#509](https://github.com/subugoe/tido/issues/509)) ([0b663b6](https://github.com/subugoe/tido/commit/0b663b661d677df903dc4acb7928ee1f53d39551))
* change the highlight of the target only if target is not null and add a test  ([#512](https://github.com/subugoe/tido/issues/512)) ([2531500](https://github.com/subugoe/tido/commit/2531500272ed55e0925cbb0429121eebabf7cf8a))
* grow the panel content height to its parent height size ([#497](https://github.com/subugoe/tido/issues/497)) ([2bd4ed0](https://github.com/subugoe/tido/commit/2bd4ed011e2bf4c5a90b0f333b9c0ff22a9f0947))
* hide variants details button when no v.item is selected ([21645d6](https://github.com/subugoe/tido/commit/21645d6de0f0e4c7d6d41ccb0b60308aac95e4e5))
* remove bug in addWitness() when target is the only child element, add checks for null/array length, make cleaner the functions in annotations.js related to variants ([14263e5](https://github.com/subugoe/tido/commit/14263e50cd103963f0e581b91b459f15e524023a))
* remove bug in addWitnesses() when target is the only child element ([e194ffc](https://github.com/subugoe/tido/commit/e194ffc842ebba0814902d51c8ccdc3b07d7c572))
* remove bug in allocateWitnessColorInVariantItem() when witnesses is undefined ([d48a87a](https://github.com/subugoe/tido/commit/d48a87a51da5707997ccb8b1be887789cc016b88))
* remove bug when clicking at a target and adding a new active annotation even if it is a not variant annotation ([1943dc4](https://github.com/subugoe/tido/commit/1943dc4f44e22bef70eade35d51056bd3492e6ff))
* remove selectAll from VariantsView ([ae9eb0d](https://github.com/subugoe/tido/commit/ae9eb0d8c4650d32c22f14a3b506fedebbfe275c))
* resolve issues with highlighting and panel actions when switching annotation tabs ([#486](https://github.com/subugoe/tido/issues/486)) ([fc99523](https://github.com/subugoe/tido/commit/fc99523b1c06d2210f6ae9075d4ddeefde277719))
* select/deselect the variant items which align with witnesses drop down selection and add tests ([#506](https://github.com/subugoe/tido/issues/506)) ([6d018db](https://github.com/subugoe/tido/commit/6d018db1168f78f61669aa1d831a4059a0df3748))
* show separation line correctly + add a test ([#513](https://github.com/subugoe/tido/issues/513)) ([9d4b9e3](https://github.com/subugoe/tido/commit/9d4b9e3555ff7a2f1a679b5175168740ca90601b))
* update caret position in tree ([229cb4a](https://github.com/subugoe/tido/commit/229cb4adf0426d201257d3444ee439914d099bc7))
* update witness design ([d2e7699](https://github.com/subugoe/tido/commit/d2e7699cd4480e7f22c6ebba16815591e654fde2))


### Refactoring

* add VariantList component to manage variants ([825c92b](https://github.com/subugoe/tido/commit/825c92b203183c983913e0c82d9b9782ac348d86))
* remove an unused variable ([6ff1bb7](https://github.com/subugoe/tido/commit/6ff1bb70be7239b2223e4775f6d6215a2f5c3f3c))
* remove temporarily the 'witness details' and 'variants details' buttons ([623c812](https://github.com/subugoe/tido/commit/623c81207f6dd4223a515375ff9adea04a8b102d))
* remove unused ([b452f91](https://github.com/subugoe/tido/commit/b452f91f2f49118b94a09ab3f57ff9a24dd74eb5))
* rewrite the class name of 'selected' state ([8ab9189](https://github.com/subugoe/tido/commit/8ab9189f9ecb6e48faa922c75c18e0a40ee93ed2))
* separate the single select mode test into multiple small tests ([39f8b71](https://github.com/subugoe/tido/commit/39f8b711c63da2c4b4187b766caf1b06d181d5ef))
* use each variant item as separate annotation item ([ff9ae20](https://github.com/subugoe/tido/commit/ff9ae20eda9306c1c2e8c1573fb4782ae22063bc))


### Docs

* update README.md ([03b5f14](https://github.com/subugoe/tido/commit/03b5f14fdb1edadb1a24d19f72d61a5c7b63d8ae))

### [4.1.1](https://github.com/subugoe/tido/compare/v4.1.0...v4.1.1) (2024-10-16)


### Bug Fixes

* update panel height on mobile screen ([67323ae](https://github.com/subugoe/tido/commit/67323ae25754906c4650dd8ba1703d13ac6a7826))

## [4.1.0](https://github.com/subugoe/tido/compare/v4.0.6...v4.1.0) (2024-10-16)


### Features

* add font sizes (default, min and max) as configurable ([#478](https://github.com/subugoe/tido/issues/478)) ([6983d7e](https://github.com/subugoe/tido/commit/6983d7eabca6109793134233f6a086a4fe1a0447))
* make 'item' label in Header configurable ([65e204d](https://github.com/subugoe/tido/commit/65e204d5cc1848b8f986caa86aaff8528c125376))
* make the header nav buttons text configurable  ([#476](https://github.com/subugoe/tido/issues/476)) ([5987dbe](https://github.com/subugoe/tido/commit/5987dbe53fa17bbe7173c6c7f1274cbf60a4e5e4))


### Bug Fixes

* display all collectors' names and add a test for this ([#472](https://github.com/subugoe/tido/issues/472)) ([c6b1ebe](https://github.com/subugoe/tido/commit/c6b1ebec0ee4146399c37e706618f184e5282da7))
* restrict the maximum height of panel to 500px ([292dfde](https://github.com/subugoe/tido/commit/292dfde3c0840b58eb35c85f9ab9ed37cab41e60))
* show panels toggle 'Reset' button text color as primary color ([e2d9517](https://github.com/subugoe/tido/commit/e2d9517eae78b24464827f05521ff5a48b83b40e))
* show the panels toggle menu aligned vertically with the toggle button on small screen ([61a465c](https://github.com/subugoe/tido/commit/61a465c09fabb0a183047e9cc12bc45c15a8e327))
* support is optional ([d54b6f7](https://github.com/subugoe/tido/commit/d54b6f7bb60cf964e412a27bf253ecebcb25636c))


### Refactoring

* add linting fixes ([6bfa91f](https://github.com/subugoe/tido/commit/6bfa91f7adf0e65e6d210c040d347b13ace9389d))

### [4.0.6](https://github.com/subugoe/tido/compare/v4.0.5...v4.0.6) (2024-08-21)

### [4.0.5](https://github.com/subugoe/tido/compare/v4.0.4...v4.0.5) (2024-08-21)


### Bug Fixes

* move the pinia instance to Tido function for local usage ([8861fa2](https://github.com/subugoe/tido/commit/8861fa2978ffcb247d22c14a8c9295013b34fe83))

### [4.0.4](https://github.com/subugoe/tido/compare/v4.0.3...v4.0.4) (2024-07-17)


### Bug Fixes

* add list of icons in README ([8c10358](https://github.com/subugoe/tido/commit/8c1035802ba3efc69ffd6eb9ed0fe33892dcc3e2))
* remove error when annotations are null ([#454](https://github.com/subugoe/tido/issues/454)) ([0d3c566](https://github.com/subugoe/tido/commit/0d3c566b02c6e9122fcaf601d9224d7f487a05c3))
* show inline annotation icons in text again ([a0a5ca4](https://github.com/subugoe/tido/commit/a0a5ca4f8c24d67cd482d3daf777e45be0add038))
* update icons config in GFL example ([6761eed](https://github.com/subugoe/tido/commit/6761eedf2d6a607309eb242ebf4aa813bc96b8e7))

### [4.0.3](https://github.com/subugoe/tido/compare/v4.0.2...v4.0.3) (2024-07-12)


### Bug Fixes

* show coming soon message for Ahiqar editions ([#449](https://github.com/subugoe/tido/issues/449)) ([a23ca62](https://github.com/subugoe/tido/commit/a23ca622e53ef596f3a850258977992d42a21d81))

### [4.0.2](https://github.com/subugoe/tido/compare/v4.0.1...v4.0.2) (2024-06-19)


### Bug Fixes

* update mobile styles ([90b3464](https://github.com/subugoe/tido/commit/90b34643a103fe03a3c1281a4d4ed5c7c3043c34))

### [4.0.1](https://github.com/subugoe/tido/compare/v4.0.0...v4.0.1) (2024-06-13)

## [4.0.0](https://github.com/subugoe/tido/compare/v3.3.0...v4.0.0) (2024-06-12)


### ⚠ BREAKING CHANGES

* drop Quasar framework and introduce TailwindCSS + Primevue components
* introduce new bookmarking format to create human readable URLs

### Features

* add setTheme TIDO method ([c425099](https://github.com/subugoe/tido/commit/c42509952f88a448dc25e90a03317b96df14a3e2))
* drop Quasar framework and introduce TailwindCSS + Primevue components ([526db87](https://github.com/subugoe/tido/commit/526db87d0af31ea9ef8bee2a2e0086de62b13631))
* introduce new bookmarking format to create human readable URLs ([8ded62b](https://github.com/subugoe/tido/commit/8ded62b8f8d5e5fa5a3f97b854a6fb9731eaef96))
* stop leaking Tailwind's preflight styles to global HTML ([4ecc839](https://github.com/subugoe/tido/commit/4ecc8394d07f9a4dd242073f98634e5cc8289e41))


### Bug Fixes

* Display configurable labels again ([2a22dc1](https://github.com/subugoe/tido/commit/2a22dc1ae484e7e06ba1f0fbfd94fb29e7ed2ca7))
* fix second title bar line break ([2bb5617](https://github.com/subugoe/tido/commit/2bb56170b5374fe37bcfae7f43e97a9b22130fd6))
* keep tabs visible in panel at loading ([96774b2](https://github.com/subugoe/tido/commit/96774b21b3000eb3c9723020cfbd8895dcec642c))
* set correct attribute at force switching a theme from config ([f7b692b](https://github.com/subugoe/tido/commit/f7b692b519bb9b1af1f1f7f6616a90210b83e1d7))
* show nested metadata & improve its styling ([7e7dc63](https://github.com/subugoe/tido/commit/7e7dc63f2933d5ba66fc6352fc14c93ba072465a))
* update only the "tido" during bookmarking and leave other GET params ([adc032a](https://github.com/subugoe/tido/commit/adc032a152ca9d4d5635fe4fd592572e0dffd0d8))
* update styles for better embedding ([d4c38e1](https://github.com/subugoe/tido/commit/d4c38e1d17cc3627605b233c81c7b9c38e5f9369))


### Refactoring

* a few 'metadata' and the 'annotation' components to Typescript ([#1](https://github.com/subugoe/tido/issues/1)) ([75e04b2](https://github.com/subugoe/tido/commit/75e04b27d45b8bbd0b0c4bab19585e7f682b4a73))
* convert CollectionMetadata component to Typescript ([9ee9d11](https://github.com/subugoe/tido/commit/9ee9d1199eaed931d78c2185839801b29440754d))
* ItemMetadata.vue, ManifestMetadata.vue, MetadataItem.vue to Typescript ([ad648d2](https://github.com/subugoe/tido/commit/ad648d20e5f783bbd8ad6cacc2cea8620f7ef465))
* now use 'annotations Pinia store' and remove the 'Vuex anno… ([#10](https://github.com/subugoe/tido/issues/10)) ([5db0053](https://github.com/subugoe/tido/commit/5db00539b750d16ffac981c22d5230b5dbb3d168))
* the 'base' and a few 'header' components ([#6](https://github.com/subugoe/tido/issues/6)) ([49274d2](https://github.com/subugoe/tido/commit/49274d2d13860b52573d2e758b7c7835a67de4ba))
* the remaining 'header' and the a few 'panels' components ([0753947](https://github.com/subugoe/tido/commit/075394720c3a1a6fee587183d12d4f143a6dd78d))
* update .versionrc ([23058b5](https://github.com/subugoe/tido/commit/23058b56f23367dcbaf0f66d5c2344563bc1b19b))
* use 'config' Pinia store - drop the usage of 'config' Vuex module ([#4](https://github.com/subugoe/tido/issues/4)) ([44f535f](https://github.com/subugoe/tido/commit/44f535f8bfc1204d8d9afa1d118617a53adc6917))
* use 'contents' Pinia store ([#10](https://github.com/subugoe/tido/issues/10)) ([3bdd435](https://github.com/subugoe/tido/commit/3bdd4358d197a6f3dfeb94bef170d0ac80b2552a))


### Docs

* Add new bookmarking info in README ([9769f6a](https://github.com/subugoe/tido/commit/9769f6a45e89a7f6c95d7ffd1e6826a5fe387586))
* update README ([0c40b55](https://github.com/subugoe/tido/commit/0c40b55048e94b7cff396041f537d3f8b1f07586))

## [3.3.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v3.2.1...v3.3.0) (2024-03-01)


### Features

* Annotations target as Array ([57a55f8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/57a55f889900c74f57d7e88106b2fb85d3370736))


### Bug Fixes

* disable option to switch off all panels ([e067420](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e0674205b6713686a584d53307ac96038b84aee4))
* scroll to highlighted annotation in text when selected ([265b6f8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/265b6f87bd1dcd9956faadb1899737a9623fdd04))
* update e2e test ([f30f282](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f30f28272dda04c68b611fe6c862910422899ed8))


### Chore

* **release:** 3.2.2 ([2d1dcaa](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2d1dcaaec9b36516bef2bde2eca6c088bce815ec))
* update GFL example config ([e0ea920](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e0ea9200dcdaa9a04376817fa6e16999e7957163))


### Refactoring

* convert all components to composition API ([923a185](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/923a1857d2b2e1df6cb6795a62b52a48b7e2a797))


### Tests

* add tests for text annotations ([2cfab97](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2cfab977dfcbfd9f07d63af22bb051fd4dd7e601))
* remove sanity checks for text annotation tests ([f062aa4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f062aa447f3d2fd3de7e9fbe8b920f23e68fd6f6))


### Docs

* add TextAPI support table ([a843a61](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a843a61293ce8be0cbf2e3fea01e79effd16207f))

### [3.2.2](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v3.2.1...v3.2.2) (2023-09-21)


### Bug Fixes

* scroll to highlighted annotation in text when selected ([265b6f8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/265b6f87bd1dcd9956faadb1899737a9623fdd04))
* update e2e test ([f30f282](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f30f28272dda04c68b611fe6c862910422899ed8))


### Chore

* update GFL example config ([e0ea920](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e0ea9200dcdaa9a04376817fa6e16999e7957163))

### [3.2.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v3.2.0...v3.2.1) (2023-07-12)


### Bug Fixes

* adapt to role array instead of string and show first element ([af9ed9c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/af9ed9cee371f6fefdcf8068bf1809a21bbd3e19))

## [3.2.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v3.0.2...v3.2.0) (2023-04-24)


### Features

* add Actor display in metadata ([e7c29ba](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e7c29baaeb3a8b5d68696ab1d3f1c7257b2995dc))
* add colors forceMode config option ([dfb0d8b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dfb0d8b7a53846e05e65d723e1d6a8967862f2da))
* add lazy loading for items in tree ([9abd7c5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9abd7c502e7cadd665adf9df6a6bf59bee33fd2d))
* disabled tooltip on annotation hover in text (unclear reqs) ([c64acd1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c64acd1fee9b28ca0a10c95852169f765f0ff081))
* scroll annotation into view when selecting in text ([5f2342a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5f2342a6ac10e9798fe6fc53e8d5c6767b7d0b1c))
* remove annotationCollection and annotationPage keys at API responses, minor refactorings ([798920d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/798920d73ee634dd44c4706f9de3d8c17d822ff0))
* load support fonts as injected style tag instead FontFace API ([a222c22](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a222c226c6c5e95270cec7299360ad36b02f31c9))


### Bug Fixes

* get support files manifest init ([2d89d69](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2d89d6935aa28b8db8fcd1f5a75a766c346b6bcc))
* add #app to postcss exclude config ([bb9d67a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bb9d67a97f46b2fc3c5ae2835c4a4685b5990139))
* add null check to isElementVisible ([110b453](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/110b45338628e71628e0b62919516915984e7277))
* avoid aborting loading process when annotation items are empty ([5bd8005](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5bd8005e32c2d06ad2e6fee394929e6a46fb75fe))
* jumping back to selected item in tree when expanding other manifests ([bf9835a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bf9835a006492e1a49eaa7cf72316e0b2fdaea89))
* README anchor ([8032855](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8032855edb3229fc2d1c128e89acf72589a305a4))
* remove infinite loading spinner when Openseadragon fails to open an image and display error message instead ([29fa6a2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/29fa6a20f08f41326af411b71fd928a4e0e7741b))
* remove URL parsing in metadata value ([b6833ae](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b6833ae91c72edf3076db7bf7180e06107751164))
* set default container in config ([075d9e9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/075d9e9d747cad28a80422270a56f3df7de459dd))
* text highlighting in dark mode ([c7d93ea](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c7d93ea1b59e7cbc5d0255c1067af742ddef7e83))
* tree margins ([b270eb7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b270eb719bdc8432b9d9847778252a08542d954f))
* update set highlighting and loading order ([75e11a4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/75e11a47e4fbe4c4bebc8dc04325777f20f689ea))


### Chore

* update Cypress ([204ef3d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/204ef3d24b3eee0f0051d4132100885e25a369f8))


### Refactoring

* add view class to each view component ([27d93dc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/27d93dc497a4f9351b950e1ab3728d73a701199b))
* rename components according to recommendations ([80491b5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/80491b59eeaa638f797d9f2e865933103daf1460))
* update code style ([b6773c9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b6773c9cbdb282ce56094f77e45d2000d0dc71fd))


### Docs

* fix error in README ([e4968a1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e4968a19a3585c92e860ab53cf645ee21340ea28))
* update README ([96d34e8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/96d34e8efb17b8f06531bb43b6b6d6b20cf6472a))

### Tests

* restructure mock API with latest Ahiqar data and fix e2e tests ([e8c574c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e8c574c7ac8e02fcff14125d53b11f9bf66ba5be))

## [3.1.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v3.0.2...v3.1.0) (2023-01-18)


### Features

* add colors forceMode config option ([dfb0d8b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dfb0d8b7a53846e05e65d723e1d6a8967862f2da))


### Bug Fixes

* tree margins ([b270eb7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b270eb719bdc8432b9d9847778252a08542d954f))

### [3.0.2](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v3.0.1...v3.0.2) (2023-01-17)


### Bug Fixes

* info dialog display ([368c658](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/368c658132f8779dcd6899ad43d2e4a7e2c73cfe))
* remove URL validation from entrypoints (able to pass paths again) ([3b3537d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3b3537d980da2615718b611c826959611c04e693))
* use .tido instead of #tido ([c42a637](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c42a637f634252749da51f2ff87d54240a76a7f1))

### [3.0.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v3.0.0...v3.0.1) (2023-01-16)


### Bug Fixes

* content overflow ([c797569](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c7975697480b6f60e050ce5291dcfe68f5e88481))
* paddings in tree ([508e1cc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/508e1cc07fc36dfe3960a65bd002c9dd73f21c1c))

## [3.0.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.5.2...v3.0.0) (2023-01-11)


### ⚠ BREAKING CHANGES

* rework the config so panels hold their views and the required settings inside
* implement embedding

### Features

* add "zero config" behaviour, add default config with initial panels setup, load collection, manifest or item from url ([44a433e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/44a433ec88e77b299fc7dc7f4f8f87381ec9ea25))
* add Axios for http service, remove unused utils and mixins, ([113a90e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/113a90ec079a9e43390e616d81c4189729c8f301))
* add default manifest label at tree ([069b035](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/069b03565ce4407fc5fec678d9b3887756e94355))
* add index util ([67c657b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/67c657b7b8c63391e8dbe56a5ea8de7cc24b8d60))
* add new panels rendering that renders views as tabs and dynamic panel actions ([2dbecd5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2dbecd5cdf358ad7b32d4731d4b9c297123df9cc))
* add scrollbar styles, minor design updates ([af15324](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/af15324f76afa5f454e9907a94bfb7f02fab5117))
* design update ([4af7c85](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4af7c859eeae3d07a4890d27a01a994ed303b180))
* import only used icons to reduce bundle size and provide config option to define annotation icons as url ([7f68a79](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7f68a7993d3b9ef721d5e53f445b97ca9ebb2a7f))
* implement TIDO instance for embedding into other projects and code refactors. ([ce613aa](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ce613aaed826ea43b5b4ec3dc0d0baeeefd52023))
* refactor bookmark service to work only with URL updates ([ee57456](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ee57456065277c62496e3663357d08f8ad7b8126))
* remove tabs from annotations view component and display only the list, update interactions with the content view ([bd9244e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bd9244e5792abe476d510808fb95542bb0a9f026))
* remove tabs from content view component and display only the text ([dc62cbf](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dc62cbff0a2aa618233ce5de5340c6acfe3c2fa2))
* remove themes feature ([cbad4a4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/cbad4a40dc7e678269e03e767d4b10447c5889e4))
* rework the config so panels hold their views and the required settings inside ([a599ec3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a599ec31ea674d9ad6507ad6e2041b721a7daed1))
* move hover listeners to content ([c987eca](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c987ecae9d47c4615c2931d0dcb90aa057cd9815))
* update header design, add dark mode button, refactor panel toggles to use Quasar checkboxes ([57e95d4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/57e95d489c31ff0a1b3341f96747742285e4d3b1))
* update metadata view, use only MetadataItem to display the values ([798c630](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/798c63077b02d5c08da9f5ad2e946ed17f61d25f))
* update panel spacings ([89de13f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/89de13fe448faa0f33832d5b3c46f3c4845c0ad9))
* update primary color ([f0941af](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f0941afd09eeb536b6d53f9b6f14549487b1f132))
* update translations, use only this_format for TIDO strings and provide custom translations from the config ([f9e7c67](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f9e7c6730724c1b0c10c1e54abd3c4adc2997fb8))
* update tree view to work more with internal comp state ([6c4503c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6c4503c724976fe56d2127907871c31dd11ff34f))


### Bug Fixes

* dark mode nav buttons primary, svg index underline ([5aedfb8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5aedfb8a525ea2b29e2a79ec9858e584367fbe5d))
* discover first content type if no config is present ([f1bb8a7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f1bb8a77df3fdd4a3325232d2c914b97d49c64b5))
* highlighting all annotation when switching tab ([f86e4fc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f86e4fc3fc4267b643755925b8640e6667b4daab))
* main loading spinner ([bfbfe13](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bfbfe1316d9fc9d5fb465039d81c9dbb902e3185))
* main view layout ([6806fbc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6806fbc3e375a484e97e8a29ea2d32bf78269924))
* mobile panel styles ([cb334ea](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/cb334eaf299b11c76e05038a42b596eea4ff5440))
* omit tree selection when the item url is equal active item url in state ([0af84c7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0af84c7f3512eeb64f255ab88dd64a076952e41d))
* remove border from annotation icons in text ([b88572a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b88572a3290b935ad9ec15630d6647e861a9e57b))
* remove color transition in annotation items ([58dbd57](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/58dbd57d0418c1b7d8c671fe6c3bc7362962498d))
* remove color transition in labels ([c032090](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c032090f8e477b9bbc0e9c717aac5b1e81f46f16))
* safari display ([da26acc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/da26accc99321d0f606075b5dc83d60e291b2d26))
* set body font to 16px ([f52217e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f52217ef3be09b12e48712b3912312b805183e21))
* set content type ([d7e04c6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d7e04c62e9049a5575e9bda8f9c0f0d36d75eaa5))
* tests ([2ed2cc4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2ed2cc47604137477b45176d7be4dce50e5d2ee5))
* tree scroll into view ([f4cde78](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f4cde7891f17f262e514995cfdcc5de7eb3a6c61))
* update dark mode annotation highlighting ([843a1ba](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/843a1ba67be93d16dbfe9e340203b48abc9966ef))
* update tabs label typography ([7b14a0c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7b14a0c8177c363b06f18ce31707b6769d87baf4))


### Improvements

* export router instance ([73b7109](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/73b710953fb68a33f288f568c6fdcd1a7310f6fc))


### Refactoring

* clean up ([f54afa9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f54afa95e8bd6f0d966a9a8e191586079583ef15))
* minor design updates to Loading and Color ([2e33fd6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2e33fd690f9e7d4788d47fea45a45d6859dd2f82))
* update code style ([dc7cd23](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dc7cd23b5789355f785bacc82a1867ae16af1395))
* update examples ([97c2dc5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/97c2dc58fc8ff583e7b30680aa6960a1884c11c3))
* update index page with new config ([44f3748](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/44f3748086b5ac36215a7647eef8dea4d1fd9e4b))
* update quasar config ([2878fee](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2878fee6577c9c1d73da5f1e239326da3924df80))


### Chore

* add config menu to examples ([9d9784b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9d9784b37d8628500a059abf8a07c93b807fc40e))
* add tido.css to examples ([7d40268](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7d40268a6b5f1215da73d23b248bfe854de60922))
* remove unused CI scripts ([262b8b3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/262b8b3f337d85dabdde5a83909633eb56c80429))
* remove unused index template. ([343a35a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/343a35a58c713baa365a4b4b06fe22316e5254de))
* remove unused packages ([2dab9df](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2dab9df4a4395937228b68b2c5555df69fbd0fa1))
* set nvm version to 16 ([bf7e49b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bf7e49b80887a0ae64454daa917b417eb66d4262))
* update config menu ([0e764fc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0e764fca21d92e6c3e2843a4ec4d770e7c09dd48))
* update dependencies ([b35e97f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b35e97fa90a5cbd87117a593ff6579b451705cf4))


### Tests

* use mock API server for e2e tests; add tree, metadata, panel, header tests and update existing to new features; execute all with "start-server-and-test" command ([40e417e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/40e417e8ded8f4f2dfa38104af91f5181a7e2385))


### Continuos Integration

* moved config-tester to examples folder, deploys to {branch_name}/examples/{example_name}.html ([2be3a40](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2be3a4044e48f8817325b153ceb618533b0beabd))
* run build on every branch, run e2e tests on all except main ([9e82093](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9e82093c1d358d43cc8d628da3f99ade4a960b8a))
* update pipeline with new e2e tests ([1714797](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/17147975a51512960c48fd115bcfb201f8421c26))
* use the same build for every stage, add stop_env stage ([32d5154](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/32d515419b8533f2629e81399121757d3f9bbb45))


### Build System

* run build at serve prod ([be24c5b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/be24c5bd8e43ad19bedc6384942ee8c16840403d))


### Styling

* update responsive design ([674a20b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/674a20b9eaa3efd8d55e9cda92da44ec112df29f))


### Docs

* update README ([d7773c3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d7773c36f51c6e21735811495bf67966bddf3c29))


### [2.5.2](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.5.1...v2.5.2) (2022-09-15)


### Tests

* fix annotation test ([1a88e36](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1a88e36addf698f7e92bf9d56a48df31f6c93b59))

### [2.5.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.5.0...v2.5.1) (2022-09-13)


### Bug Fixes

* default connector tab index ([db60cfc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/db60cfc84bd8390a894f3da158aa70ea6e30f491))
* loading bookmarkable tabs from URL ([d8f0348](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d8f0348a99a74a22b2d32eb115e0f7af31e770ff))


### Refactoring

* remove unused code ([3645265](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/364526597ac8567b416a2c5fc7cf07fc88220b4e))
* rename some variable names ([6d652ad](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6d652ada14c80346850e9f607662d77da43b576c))
* use dedicated methods to update content and annotations at bookmarking ([7893e51](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7893e512953c0980eabcbf3023f5f76883769e72))


### Tests

* add annotation tests ([7926aa8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7926aa863bf38a8a4841adc81f78023ed185d2e9))
* add content tests ([8975328](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/89753289296bf1a9b6c208285e3a4c8f5c34a54b))
* update bookmark test ([d801c37](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d801c3777e993260ebd1b51164352e5e04ccf740))

## [2.5.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.4.1...v2.5.0) (2022-09-05)


### Features

* Bookmarking - Implement bookmark functionality for Panels and Tabs. ([866cb0d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/866cb0d88f8e32115bbb668c36fdad47ace8c48a))


### Chore

* **release:** 2.4.1 ([5e53d0a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5e53d0a617614304691f96fb913f2b52041db0cf))

### [2.4.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.4.0...v2.4.1) (2022-08-30)


### Bug Fixes

* manifest URL comparison ([913a47c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/913a47c6aefad1b48868c7546420942e71c5b433))

## [2.4.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.3.0...v2.4.0) (2022-07-13)


### Features

* Implement user notification when no entrypoint is set/ empty sate. ([91d6e0d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/91d6e0d8af21031dc30670bfa1aa7931bb4d71eb))


### Bug Fixes

* remove an empty blank line. ([4b7378d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4b7378d1ded2da8c9a702713b15cafb5a7d72ce1))
* remove console statement from tests. ([d34c180](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d34c180bff177aab829b59747b9535d407be4906))


### Refactoring

* move error handling to catch block. ([4e57b51](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4e57b51dca21c427f22622edef5e38af77e6670c))
* use only MetadataItem in manifest metadata ([2db85de](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2db85de20f16d63641bac5e61778b39919438395))

## [2.3.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.2.4...v2.3.0) (2022-06-28)


### Features

* Summary term when multiple parameters are passed through search. ([569bc0a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/569bc0a634c57584bd815ace50384fdf66e95ebc))
* update metadata styles ([5f56563](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5f56563f8f1e5225f382dcc3d4b860be5653c316))

### [2.2.4](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.2.3...v2.2.4) (2022-06-21)


### Bug Fixes

* added a handler to display spinner until image loads. ([4a635a9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4a635a9b0e746ea71ae2697123b6327060cf45a7))
* collection title color ([7e46b44](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7e46b446bc4228dff682c47f748018cd7adc8f9e))
* color switch tool ([f340ae3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f340ae3ef729f025e049fed16b860e2147bdf64d))
* colors setting from config ([2ff77b7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2ff77b7d5f948fe36aad5c3c87d131b3c85f302c))
* header colors ([27f28ab](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/27f28ab0e05df2a5332c53ef486488a17ced611b))


### Refactoring

* add loading spinner to tree and image. ([0e3a168](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0e3a168fe7d27af080bdf3ccbe7cbb3bdd295ab6))
* add missing states for image loading. ([9783bd9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9783bd997cf3884b30792a750ee0534e35cf5e45))


### Continuos Integration

* deploy old develop and main artifacts only on other branches ([f98418a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f98418a531c941479f105cfd6f089a8a59032685))

### [2.2.3](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.2.2...v2.2.3) (2022-06-07)


### Bug Fixes

* loading of annotations on a slow network. ([6457e94](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6457e949c83d1ce14f3c2195e45bd8c85f95f229))
* text highlight when switch tabs. ([dbcdde2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dbcdde20fd2589b1b6537a6a6d6f493f9f23095d))


### Refactoring

* ensure autonomous loading of panel components ([0f4d443](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0f4d443f4d1195ca53b8a9f59c38160aee72f3cc))


### Tests

* Implementation of Cypress E2E with minor test cases. ([5b21a43](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5b21a43ab5107605fee80f3cdebb840f767a09a3))


### Chore

* remove entrypoint. ([fa97aa7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fa97aa7ddf12fcd44c97931d1ff6e18b8952164d))

### [2.2.2](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.2.1...v2.2.2) (2022-05-17)


### Build System

* remove tweak build from npm scripts ([8f28fbc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8f28fbcd13ad3c82683e46f9fabd8571135117e1))

### [2.2.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.2.0...v2.2.1) (2022-05-17)


### Tests

* script changes to release package. ([d2b638d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d2b638d9523ae54255f8b63cf765fc773eed0f82))


### Build System

* remove tweak_build.sh and create files with Quasar build ([4dc3d44](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4dc3d446a3530c0caa194aa19f86cd3b2a57f5c3))

## [2.2.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.1.0...v2.2.0) (2022-05-12)


### Features

* upgrade quasar and vue version, code refactors accordingly. ([16707af](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/16707afea8af907a5754f2c11eb3a97da148f6ab))


### Bug Fixes

* add a script to export version. ([43886ac](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/43886ac94a56fab1bd1d14d54b7bf89ec45e4aec))
* add directory property to config ([eec385f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/eec385fd467f8289d3682856c452538dfbfce85a))
* click event on tree open or collapse ([b9b826d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b9b826ddf7c89c43009bf0a26014cd2387b187c1))
* displaying of version on info. ([101c0c5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/101c0c5a6888b800abb38659be2c5ea12a133c40))
* reverting node version in package file ([7522058](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7522058a4afd55572b12243be8774636193c466b))
* scroll behavior for text and annotation panel, removed quasar conf file. ([250dee8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/250dee8fda4ac28ab6b432f446476397709e33ff))


### Docs

* update README ([42d38e0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/42d38e0df0cebfc4e1b6b84b5db0ec31fc69cf71))


### Continuos Integration

* add collapsing to config tester ([6f39b31](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6f39b31022980b21c59f67379817995d275ecde0))
* fix config tester active buttons ([600b00f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/600b00f58efe336ff76e1b6d7165ecea1d31e77c))
* improve config-tester reusability, add Ahiqar Arabic-Karshuni ([54b8088](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/54b80884c1da58eac91cda8fe7a8e228be8d9fbf))
* remove clean stage ([14a512e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/14a512e2596210e9b58507213efbc1dda9b293d4))


### Refactoring

* importing package file to receive version update. ([7e22f58](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7e22f585cec8736c0f8a69d60e79d69e370291cf))


### Chore

* remove entry point. ([c546226](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c546226dd67a8f6da0eee23cdbc7fb95e0e5b913))

## [2.1.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.0.1...v2.1.0) (2022-05-02)


### Features

* add cursor pointer on text hover ([318f9cd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/318f9cd2a61914a458bdf6a9346bda07257d5861))
* add deselecting ([b1a3c79](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b1a3c79a0a9c86d715fbb301e4f5120cff22c9d8))
* enforce select/deselect on text click for all nested annotations ([53a263f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/53a263f8f583ea7ec5450b5293a4245aa8adb2f2))
* implement text click to highlight all corresponding annotations ([0d0c99a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0d0c99ac3c84becba8452a8b3a73199c842bffcf)), closes [#365](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/365)


### Bug Fixes

* check if clicked text appears in annotations tab ([8f7919a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8f7919a11b42e8fb0cd8795ed7edb115d25d5e3a))
* range selector hightlighting and get a valid click target at text ([7e0a118](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7e0a118e91fff9cc0dac880130e8457e36a4e228))
* set highlight level recursively at selecting annotation ([41298f1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/41298f1b915d9545d0837d189f66e957202622a7))
* tab highligh when switched between manifests ([662c9be](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/662c9be60ae684096222523d517d9f1df77294ae))
* tooltip display ([052bc4e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/052bc4e1eac2bf643af908a6db5217227e4d974e))


### Refactoring

* move add/remove annotation to store ([c61efcb](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c61efcb5b8b80803bcd5cb722a6511dac86c1e9a))
* move filtering annotations to store ([76ba773](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/76ba77398b7942745d123c8e82cb38a8de70ed57))


### Styling

* fix code style for Quasar CI build ([72b8eee](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/72b8eee1ac257b07d067601246b894eea429eb80))
* format code ([19caca7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/19caca7422adf12791bbb7197df88078d9fea9fc))


### Chore

* add ESLint rule ([d8abe60](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d8abe60e277869b4ed3f57c777d7ff38f9f45fa3))


### Continuos Integration

* add config tester overlay for Gitlab Pages and restructure scripts ([02b01a8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/02b01a845c8eddd927b7ca1dabb117d61eaa3895))
* fix entrypoint issue for branches ([7308e4a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7308e4aa6f66364734cf1923d19621fe823cdb1a))
* fix setting main endpoint for Gitlab Pages ([e2cf88e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e2cf88eb611b7aee1f3d19407ac914863612025a))
* remove entry point ([16eb30f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/16eb30f2d6c8eec9ac96bb94570a2ab8a0f3bd83))
* remove entry point ([3a23e8c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3a23e8c96b1a0901910b0e805ac4a83fa648d156))

### [2.0.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v2.0.0...v2.0.1) (2022-04-14)


### Performance

* cache implementation to reduce store actions ([79dab64](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/79dab64f0fd82035f34ffdfb0438008ee37148a8))


### Continuos Integration

* build and deploy only to GitLab Pages but use Ahiqar dev endpoint ([222702c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/222702c6a247bc98c1eea7de1e21c45bde2f78d7))
* remove entry point ([b4944c6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b4944c66e67d52f34e872c9e7bf669e5f52162c7))

## [2.0.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.26.0...v2.0.0) (2022-04-12)


### ⚠ BREAKING CHANGES

* We expect now an annotation target object from the AnnotationAPI that can result in a valid CSS selector. If the target does not provide either a CssSelector or RangeSelector objects, we fallback to target.id build a CSS selector from that.

### Features

* use CSS selectors for text highlighting ([e656069](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e6560692e3c730570f919fc67b0d6658034787bb))


### Bug Fixes

* update the content on manifests change and tree arrow error ([92f74c0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/92f74c0a53eccb22382ab39fa292a2608c2c725d))


### Refactoring

* watch logic to update the state ([f712f7c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f712f7cd45b997f61fc9ceef7ba51cd2996d61ca))


### Continuos Integration

* remove entry point ([a53b225](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a53b22550c79ecd376ea8c67a18736d9b13afb16))
* remove entry point ([a0473b3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a0473b304ed7e72d90fea8c850133e7469c4ea69))

## [1.26.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.25.0...v1.26.0) (2022-03-29)


### Features

* implementing stores for tree and text panel and Refactoring config ([3126969](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/31269695a417b0d4d9b41653381f6ca98afa4f66))


### Refactoring

* fix unit tests with new comp names ([d233a8f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d233a8f2ca64edd91eff07df331f758470f8fffe))
* moving panels to stores and refactor panels mixin file ([fc42b5e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fc42b5ec4f9b7158c8c383b13bc4bbaa15cc7ac5))
* rename component and remove obsolete code ([05aa1e4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/05aa1e44e4c6a935927d523e6545d48f9f39f6fa))
* rename components according to style guide ([0519ee5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0519ee5e672074150696d0f96197842b4f5d154d))


### Continuos Integration

* remove entry point ([845e2ff](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/845e2ff8c4b64a6d4a1a296c1e3585e51756ebf1))
* remove setting entrypoint on wildcard branches ([d10c2cc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d10c2cc2625550557b09050e5bad26892db0e7e5))

## [1.25.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.24.3...v1.25.0) (2022-03-02)


### Features

* render metadata objects recursively as lists ([4c1b9bf](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4c1b9bf30408d50aa2dc7f0c88f3c50be8d97f25))

### [1.24.3](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.24.2...v1.24.3) (2022-01-31)


### Bug Fixes

* highlight of annotations on dev instances ([b667396](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b6673969791ee30959965b36ea8dbe9986b6db19))


### Continuos Integration

* remove entry point ([3503227](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/350322759879b3cbb7118e1b1d8688345e40e6f9))

### [1.24.2](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.24.1...v1.24.2) (2022-01-27)


### Bug Fixes

* font styles in text panel ([1255bd6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1255bd61ac6d1a470c557ee701f07e81c03957f5))


### Docs

* update readme file and add missing documentation ([20db0bc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/20db0bca0d2db1810d64608dd518fcd9c657bcaa))


### Chore

* remove annotation mixin ([4cd56be](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4cd56bedfcc6a97cc1aa23f3a08a0b60cade5968))
* remove obsolete file ([6df91e9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6df91e92b994fad574fde9d2bb93ae0a84260203))
* upgrade to OpenSeaDragon 3 ([b24777b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b24777b09be99ac34291371306da07d0785ff918))


### Refactoring

* implementing stores and code refactor accordingly ([1969b2c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1969b2c9af995db5dd7a2ff2b5fdeadb2f855f31))
* remove redundant usage of import statements ([764c350](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/764c3501083558dd2bb6b26fa3522195840a753f))


### Continuos Integration

* remove entry point ([eb48316](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/eb483163e12c2f2812a91a72b475233820831f90))
* remove entry point ([6e01b35](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6e01b35a39a7dac1df0059cc1cfa51d9999d8241))
* remove entry point ([e3b817e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e3b817ee266a467647223ec48e5d8b3ed0789b56))

### [1.24.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.24.0...v1.24.1) (2021-11-15)


### Bug Fixes

* fix the annotation display value ([2b7d583](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2b7d583980c4acefd9294742b1c8720a76724a2f))


### Chore

* change app info index ([dfbcad0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dfbcad082cf1df2055cf97bd566309fc7e0b26d2)), closes [#351](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/351)


### Continuos Integration

* remove entry point ([328ba8e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/328ba8ea8549728e4cecb7535a0f438c7ae5c99c))


### Refactoring

* edit display of link for gfl requirement ([b34ae9d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b34ae9d4ffde6abfbda8dd90ac4baf91dbc9ca81))

## [1.24.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.23.0...v1.24.0) (2021-11-02)


### Features

* setting default text panel tab to Edierter text ([19d60ff](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/19d60ffa35328e8cfd2cf70fa42663bb69f37822))


### Continuos Integration

* remove entry point ([8faa97e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8faa97e774a36b284a0e66478a17ea9c5b269083))

## [1.23.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.22.0...v1.23.0) (2021-11-02)


### Features

* adding a new tab related to enlaeterung ([21664ad](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/21664ad5fd2c67c887dce641b54433c336249657))


### Bug Fixes

* sort order of annotation list from backend ([d5a4e4a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d5a4e4aae740e841cb9d3b05d440647869960925))


### Refactoring

* add missing colon ([ed28000](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ed28000b31d3163c22362fffb6a9e13f610313d3))
* remove indentation if there is no index for annotations and update readme ([15bf470](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/15bf470af2206aee0ee5d784256da97ae8fb5e80))
* update index.html and readME files ([c20a9f8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c20a9f8bb36bc17a4ccb69104bf6a0967c4b528d))
* update logic to display erlauterung for text ([9481aea](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9481aead3f3bf2b9395b1667ad30d9329aab96ac))
* update logic to display notes and notification message ([dc2e175](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dc2e175cb5086b7dfa5a2ea8aee892e4308bab7a))


### Continuos Integration

* remove entry point ([c159287](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c1592878bf2c7393c24f526446e505a05e64db19))
* remove entry point ([41216b8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/41216b894044491489504a475bd0355a1364ff3e))

## [1.22.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.21.0...v1.22.0) (2021-10-25)


### Features

* text panel error message notification ([89753ef](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/89753ef975037bd4ffe77dc7665f54345cf6c7b8))


### Bug Fixes

* third party application short notation the bookmarking doesn't open to exact shared sheet ([09c012e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/09c012e88f49686cce6d524bbd52f7c4c1d2396d))


### Refactoring

* addressing review comments ([b355fa2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b355fa27630cf7df9f6a6ebf00e7b11908f91aa6))
* display project specific styling in annotation panel ([deb9b24](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/deb9b241afe2248c5530c07557a81688365bc179))
* hide collection and manuscript title when tido loads with singel manuscript ([0c696aa](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0c696aa91f31965e762d834b03ab798296164a65))
* removing extra condition for loading spinner ([e447d7a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e447d7a99caad01c1102939370a2541f627f54f0))


### Styling

* reduced indentation of tree sheet title ([2ef8fd5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2ef8fd5ab359bf328ac0cb3b23cd191be27cabb5))
* reduced indentation of tree sheet title ([0da4f49](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0da4f49769b9230ea259aa87005bf47665da22c3))


### Continuos Integration

* remove entry point ([ada8b18](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ada8b18ccdf1876a2187d18b098c1c70de7e2fb7))
* remove entry point ([c4c0dc9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c4c0dc98e2c383d734da1563da1d3456da8686d8))
* remove entry point ([1732334](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/173233410602e67954a7706ebc41704d1aef6c65))
* remove entry point ([d00c90e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d00c90e88b04070a2eafbd12436215a253f00eb9))

## [1.21.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.20.1...v1.21.0) (2021-10-12)


### Features

* unselectable text of list items in annotations panel ([8ba7be3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8ba7be3aac0d61797931ad12808b622b0ba49680)), closes [#345](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/345)


### Bug Fixes

* dark mode contrast issues ([d6c723d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d6c723df2e4f4be144b392a4965d85910efdbb17))
* dark mode contrast issues with text highlighting ([0a29094](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0a290942a56b44de44a347c05387e84acfa8a34a))
* header responsiveness ([8c9c7a6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8c9c7a659cc80393986e2775f0faa4cd18c71064))
* header responsivness ([17424e3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/17424e3871e87d428766ef7fbc344fa2ecbeb389))
* options index displayed in it's respectie annotation panel when changed position ([05506a8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/05506a81bd53b1ba1aa93e9c47310c2499a5c390))
* panels responsivness ([024a060](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/024a060fe4b8121c54bfc7b5ea02c613bc505ad3))


### Refactoring

* addressing review comments ([c142edd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c142edd72d5517f19c1b5c49929d6f872a217458))
* addressing review comments ([ef6cfe2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ef6cfe28eae2790a18b6933fdcd37e120633e02c))
* check if annotation is active ([74ab1d8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/74ab1d8ad07b19d41bfba73b6be0fe148e2da73b))
* renamed class name ([2e173b1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2e173b1e66c3d569b0b7f64f2ea56172b14e0725))


### Styling

* dark mode contrast issue in text ([6cbc011](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6cbc0118c6d0321fe0b74c3861da3c196c82a930))
* modifying colors to fix contrast ([ed736dd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ed736ddf186e6126352ad3ed6358317c664a1054))


### Continuos Integration

* remove entry point ([43cfa0b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/43cfa0bd19a74fd6b52b3546f7129f436b85acc0))
* remove entry point ([2417212](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/241721270aa01181b88a9baa193a31635863df1a))
* remove entry point ([580083b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/580083bee95c3ddb9fbbe42aa318f2061ec58537))
* remove entry point ([3d3e562](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3d3e5624a0a7f0ccbb5308857edf5c36b3d21a41))
* remove entry point ([50352df](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/50352dfed5b6a5474c1368927d3f252a2ee7f309))

### [1.20.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.20.0...v1.20.1) (2021-10-05)


### Refactoring

* addressing review comments ([ede90bf](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ede90bf6c6b03fb0d29374904759cdff37dd2f1d))
* addressing review comments ([c9d41e3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c9d41e31a288822448843a1b1232fd1db1e366b9))
* default language change when the language switch is turned off ([aea97e8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/aea97e8ce0a352bdc66390fe92ad5053655c12b1))
* make project header configurable ([49dff10](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/49dff10e69128590e29462814466774db784c03c))
* modify translations according to suggestions ([fa59dc2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fa59dc29cc72709ea4b2728d17299227c4596ae6))


### Docs

* rename according to new changes ([c142b3f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c142b3fc41311b76b97f381d48d7121b49a1e50e))


### Continuos Integration

* remove entry point ([1e83b12](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1e83b129ac588100a58f8e454d96a6ff0df5a012))
* remove entry point ([7cfd7fb](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7cfd7fb944807c7d3efa28955f8a5647299cee71))

## [1.20.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.19.2...v1.20.0) (2021-09-24)


### Features

* add new error strings for images ([ee1d5e6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ee1d5e6f79c2fc0d8cef2e6e70d67382919b145d)), closes [#339](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/339)
* add second image error message type ([07f5268](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/07f5268780171463c95284e7b9e92cf7eafad2d3))


### Chore

* change package description ([7ab858e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7ab858e05b10bb80f762574567a07e388219f8d8))
* improve wording ([d28a51f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d28a51f465ca64bc074f64559979d6460ad4c2a3))

### [1.19.2](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.19.1...v1.19.2) (2021-09-20)


### Bug Fixes

* check if image key is present at API response ([8427dc8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8427dc8387028b39a165235f75e3ff929651747f))

### [1.19.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.19.0...v1.19.1) (2021-09-17)


### Bug Fixes

* minor typo ([8f95424](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8f9542411a57fb51d45fd2af4902b1787d56dd25))
* refactor logic to display font styles ([ee61e54](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ee61e54a8509021f3f1442607ba228c5327d605b))


### Refactoring

* addressing review comments ([50d4c5f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/50d4c5f998281755adf8a5d8e5452b890cd6edde))
* anchoring manifest title to top ([c59f273](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c59f273766052ad99c9d5882d08aa574530c5bb6))
* remove redundant value ([1bd6dfe](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1bd6dfe8dcbed3ce065f1a093898950e766e01fd))
* remove unnecessary code and modify styles ([3a3cc94](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3a3cc948b390caa5c29d2c41c962a6a2c3ee4623))


### Continuos Integration

* remove entry point ([59af81b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/59af81b4ff95f267719322f48cad4208e911cb9f))
* remove entry point ([a9ca685](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a9ca68516fb6b10338058c2c4bf79cfe9439df4e))

## [1.19.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.18.0...v1.19.0) (2021-09-09)


### Features

* adding a method to get page numbers navigating from search ([3eefaf5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3eefaf5d6a98234201ffe8983f45fd8d58757bcc))

## [1.18.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.17.0...v1.18.0) (2021-08-31)


### Features

* displaying error message for images when there is no vpn ([39e7461](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/39e7461d19b973d8c7101fd91739705ab9c82c97))
* implement config option for the language switch ([91add1c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/91add1c0fa50b9319fd277b84ee493313b19c497))
* make the theme switch toggleable ([72326cf](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/72326cf250e8823a9b0c9346c2d7c8739a9e5253))
* when changing sheet the selected tab remains open ([b263c29](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b263c29c7e676e3c9dad03058e7af2e13e488ef2))


### Bug Fixes

* displaying tido with single manifest ([b92a445](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b92a445a602358ba022bc47db5e053d9d3885930))
* hover over tooltip for outer spans and it's selected text ([b455cf4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b455cf4386a420aae69ef77d26a923ff89eb8662))
* revert the conf option in regards to the review comment ([2d14d59](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2d14d592c50fb679a2a3a5b060fe4413d7cb0cf2)), closes [/gitlab.gwdg.de/subugoe/emo/tido/-/merge_requests/217#note_375950](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/note_375950)


### Styling

* just syntax fixes according to linter ([f727765](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f7277652e081dec13f3e401f73972d7019441c48))


### Chore

* delete the footer component (according to review) ([c12f581](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c12f5816ca996e0ebf9accb52dc9f34fa670b0d6)), closes [/gitlab.gwdg.de/subugoe/emo/tido/-/merge_requests/215#note_375185](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/note_375185)
* merge latest changes from develop ([8b0c87d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8b0c87dd0e29e279c5bf73a7182d929cc3696348))
* set default value to `true` ([56338a5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/56338a55953721b223d7d01af78a36cebc10469e))


### Docs

* modified title according to stake holders requirement ([73edc36](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/73edc36a05ae39a9b449b45d782118ed6712b6b5))


### Refactoring

* adding a comment to function ([5c74208](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5c74208e865ecac6ad99357b45e992c58260c555))
* delete legacy code (standalone) as agreed upon in today's refinement ([26071d5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/26071d5c941ffe5c04e373d43737e83edbfd1889))
* switch off the color theme toggle. it's already configurable via index file ([fbcc6c8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fbcc6c8171a6f8d31e9749933c3ea8785eb743dd))
* updated color check method and refactored display of list item ([00d44e4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/00d44e4573ec4c45dfa6b6decde9e8d7a0285376))


### Continuos Integration

* remove entry point ([3802c0e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3802c0e3abddb846705f1259b99c69af57c285a0))
* remove entry point ([5ce146f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5ce146fc35ca27e15bd9d7448a0d45d229de4884))
* remove entry point ([24406ae](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/24406ae1262398a09408ac52bc36de3ef109a50a))
* remove entry point ([0eb94db](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0eb94dba0d98fb627f059c9552a2004cfbad8fce))
* remove entry point ([bb23eee](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bb23eeea8f670f4345fafc0bb338c093af0d3b66))
* remove entry point ([8dbca9c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8dbca9cbf46477e2e95b91c1ab2ddc4cd5c6714c))
* remove entry point ([de6bd9a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/de6bd9a5a126acbf68f36ed495c99a48b65a9b05))

## [1.17.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.16.1...v1.17.0) (2021-08-20)


### Features

* display nested motifs and refactors of current logic ([ce38ae6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ce38ae6a8d7cf4c307516e175b7ea3d2d0387a60))
* implementing hover over text to know which annotation it belongs to ([255907b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/255907b09735888615e88f2a389e0ee8016d9d8d))
* scrolling text into view when an annotation is selected ([23d0e9d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/23d0e9d5f1d84d006469a9b30e8a25a30703fdce))


### Bug Fixes

* color for tab title and separator line in text panel ([3cb3589](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3cb3589ca627042503336417a7061aaf867562b9))
* remove obsolete space before the colon ([d90c938](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d90c93817009a91e9e38c4c971dacfe00f03464e))
* search result list bug fix ([0924dbd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0924dbd531827da1002c088079dc7b9eafca2172))


### Styling

* improve styling of annotations info hover ([9a9dbaa](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9a9dbaac6ea37b615d6bc82de1f695962a9ea470))
* improve tool tip content formatting ([ec5b798](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ec5b79811cfcb1b8c7b295141eff45678c892f7d))
* just minor formatting ([01e247b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/01e247bc69eb2f745b4840717fed40c6bb0116b8))


### Refactoring

* add icons to the start of annotation in text panel ([0c12a55](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0c12a55d39e01be9dcb411335794893b4a950af0))
* addressing review comments ([fa686eb](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fa686eb7690e89acf0720835bf88d7be295ca879))
* addressing review comments ([c5346ab](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c5346ab8940cddc5bc3693843882b3573a6877fc))
* appearance of annotation references tooltip ([dbfaf94](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dbfaf94a6c334c3798900d2b72f2a4ae2b2c0f12))
* delete project specific code ([f23ef89](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f23ef894852e06f0962f618b5313ac806f1d1301))
* display tooltip when there is a selected item in annotation list, address review comments ([c70e5f7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c70e5f76f840a64cca67761e4582e45648b236c7))
* minor method add  according to the data changes ([b08d1ed](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b08d1ed19d4874f6d6ddbf2b545f690a38a5b34c))
* remove obsolete code ([4e86c8e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4e86c8e7ba2272af7729d73df5e932b64ebf4f85))
* renamed according to review comments ([00736ca](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/00736ca3cbdfbce39750c7d9b137e2e28e59625e))
* update logic to hove according to the new data changes ([0e8eb82](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0e8eb82689b63f824d26907dc08b97e903bdfe3e))
* updated to display nested values in tooltip ([f6e6a50](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f6e6a50b2ebdb26d11199f54f8d326f9fde9d035))


### Continuos Integration

* remove entry point ([96a2899](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/96a2899db25a1acc6eb7891344b9adbdd0e6febb))
* remove entry point ([1e3617c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1e3617c4d22d0c05abc7c6c57dac6f57aff7a0ea))
* remove entry point ([b1d9474](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b1d947469b997d3d6a9659063d16ad1bfe00e28d))


### Chore

* merge branch 'develop' into feat/[#318](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/318)-text-scroll-into-view ([21a4f3b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/21a4f3b9c28a21184e40bdd9e4058e548a1e07c9))
* merge branch 'develop' into issue/nested-motif-refactor ([4384015](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4384015f6bc796318f0264be617962c61bf63417))
* remove obsolete code ([9c26edd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9c26edd1102626c6e84162db84f2d9906a247100))

### [1.16.1](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.16.0...v1.16.1) (2021-08-03)


### Bug Fixes

* navigating from search breadcrumb to website ([902354f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/902354fcfa0bc079892940c6768ed379a35483ae))


### Refactoring

* probit users selecting text in tree view ([e6a101a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e6a101a9b498848acbe56eb5076f435abeb775f1)), closes [#320](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/320)


### Continuos Integration

* remove entry point ([506c59b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/506c59bcb6938a76084f1cb59fca5b1a9c383d55))
* remove entry point ([e9e7c28](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e9e7c28bf1f9817b68ad32f5f2ff774f037cb71a))

## [1.16.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.15.0...v1.16.0) (2021-07-28)


### Features

* implementing of search in header and navigating to home or search page accordingly ([7456a18](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7456a18f2343465cc8416f517702b4ddb54a53eb))
* new domain urls ([e9b5a0b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e9b5a0b66ae2cd6b650e946b41c38270796fb4b7))
* provide one more zoom lvl in text panel ([36c4535](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/36c453535a25d93b751bd02d973aec3dad3b4310)), closes [#316](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/316)


### Continuos Integration

* remove entry point ([7b40d19](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7b40d19b2e3fb6d2bb86b76f7148599923115aa2))
* remove entry point ([4d41f8b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4d41f8b1d4bec8e579df201f93c7dd53fa006e0e))

## [1.15.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.14.0...v1.15.0) (2021-07-21)


### Features

* implementation of loading in annotation panel ([41e9596](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/41e9596ec2ba02b96b2c2d9397bd1efcb11e418f))
* make notification component  configurable ([72620bd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/72620bd686886ff2d8835126138442b8ec04b323))


### Bug Fixes

* disable/not be clickable when there is only one tab ([54b5a8a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/54b5a8a4dea9d1707f182ef65a9ec8b32194d6ea))
* remove marks in text panel if annotations panel is not visible ([bb3341c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bb3341cb41c96871a08378c7b1a68daed9a8bc70))


### Docs

* typo changes ([3aa047c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3aa047c227d0f829c3a050c2806bf863a6457e8f))


### Refactoring

* add colors to config, updated readme ([afb88a9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/afb88a9b2b06ed2a71d4ad0888d230043ac619e3))
* addressing review comments and renaming ([5c5d6df](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5c5d6dffcb569acc41017406832d9daff4d58e70))
* remove absolete code ([8b1c241](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8b1c2416ec83e7588a2e24ecd89567c1c507e75a))
* remove prop passing and using state ([58dd2d8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/58dd2d855ae5a10c06e98f8cf62033bd640aac5d))
* rename according to review comments ([e70531c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e70531c5083677c810598eb647c9f44a66968f23))


### Continuos Integration

* remove entry point ([ce25915](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ce25915233bc7bf82dbf9da589c63237d098b202))
* remove entry point ([d2e86af](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d2e86af9cbac2a4b20e4f4567c8754f63fc509d0))
* remove entry point ([4edf4b8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4edf4b8b83180deb90924d8e0a2483cdae1c3469))
* remove entry point ([497ec85](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/497ec8551c1906dd8819a7aeb54914b657e0a920))

## [1.14.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.13.0...v1.14.0) (2021-07-07)


### Features

* add project header (wip) ([246928a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/246928a05dbe43ef3762b7d3f24ebe4f91eb62fc))
* add search indicator to project header ([c4e3276](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c4e32762f9c8ec3a30f18db7b9ee4f19d412fca1))
* adding links in header to navigate and refactor ([8d35274](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8d35274a2b374d246b6eaf5a682930512b14d642))
* annotations to display default order by appearance ([a9197c7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a9197c7d4127d6f71c9f7932f28f20d0ba80786a))
* highlight nested motifs that span over several lines in text panel ([5774ce0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5774ce05dd85c0546a94944719b979ef7e79f9d7))
* implementation of bookmarking in default view ([590e284](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/590e284f304d328dbbd58efccef24c86466c2523))
* provide translations for the header breadcrumbs ([3ee6403](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3ee6403997042f6694d504895f52af8836234125))


### Styling

* improve project header breadcrumb ([ac18c79](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ac18c7934857bfbb5d4c036bdfb4784c807db947))


### Chore

* add entrypoint for merge development purpose ([2afa8da](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2afa8daf598bc16d1938f1e61b9e5cdcbd7aa961))
* merge branch 'develop' into issue/projectheader ([426e4ac](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/426e4ac6839e3fe5dba921565b720c023a667ed4))


### Docs

* addressing review comment ([8d50a86](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8d50a86b753933f6f87cdc58e7ae845096c04329))
* project header and config ([b84e7de](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b84e7decb34500f00537ab643e419c9de6e1df74)), closes [#289](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/289)


### Refactoring

* adding comments and renaming ([7ea7317](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7ea7317ec305f913d1ac3639537271d9654eebff))
* list highlight options ([ef057d8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ef057d81eb46c925aba5f6ea8e9b0ee2363fd7ce))
* minor code improvement to separators in project header ([ddbf2e2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ddbf2e23bb2676e165bb1927ad8a4fa4d69221cf))
* moved dom manipulation logic into mixin file ([171b784](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/171b784ad069910ba4b069c4cceadc4491d4f40c))
* remove obsolete code ([7ef25ef](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7ef25eff11edeaf660b3841bc8369153e9c61a63))
* remove search breadcrumb and refactor styles, renames ([af4248b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/af4248b819ac733d2f9e224b87738df85896eedf))
* renaming and addressing the review comments ([fbceafa](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fbceafabea164ebb8241db7e47d4f55efdc0caec))


### Continuos Integration

* remove entry point ([f5721b5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f5721b59e5abec2249f6ee3e965da9ca3face10c))
* remove entry point ([1d5efe2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1d5efe2bf467b08279d39f50c18d24b6fb4353c4))
* remove entry point ([8ae5732](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8ae5732ec299e76bcbf53a24fcac0e96d3457644))
* remove entry point ([5028bff](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5028bffe6e18f0433f0a4b4b2e223ab2b2827e8c))

## [1.13.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.12.0...v1.13.0) (2021-06-24)


### Features

* display font provided by support object ([cf37200](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/cf372006c8b3980421121adf89349119c08ef1f7))
* in- or decrease the fontsize in the text panel on click ([139220a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/139220aa98fe798a502d23ae8ca7246bf3673ed1))


### Chore

* move build script to new folder to keep the dir root clean/er ([94044fa](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/94044fa1b795cf849477da85b48d99f995a144b8))
* revert config to original state ([eec6bb3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/eec6bb3d8ab1908f77869b9463c72a6a92594454))
* switch title toggle to true on init ([a533f92](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a533f92bb0d58dda217e097eeff732ac0c209acd))


### Refactoring

* adding font family to annotation list ([e192e8a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e192e8aaf11ef1f6d80364c1d2a802c77acee721))
* addressing review comment ([d596c0d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d596c0d2f4ed455950941d6f0e3d13c2a438e933))
* change fontsize units from em to px according to the revie proposal ([2465db1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2465db13ba05512e83abe2f05067f2fd875c9908)), closes [/gitlab.gwdg.de/subugoe/emo/Qviewer/-/merge_requests/188#note_341244](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/note_341244)
* disable buttons whenever the fontsize exceeds the limits defined ([5abadc5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5abadc59130c3b2a322075e64ec94aa4935ac07f)), closes [/gitlab.gwdg.de/subugoe/emo/Qviewer/-/merge_requests/188#note_341352](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/note_341352)
* display tabs accordingly when there are two text types ([e30c705](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e30c705adc0b594653febc98d6a00e2f7374f081))
* group the tools (language, sw-info, colors) into a single component ([b993155](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b993155731c835159a846faf6073d1cd8ddf58eb))
* rename infobar to titlebar, update README and adjust the code appropriately ([fab89b3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fab89b39ac9687a57fdee1b8583831be1f67d0b5)), closes [/gitlab.gwdg.de/subugoe/emo/Qviewer/-/merge_requests/186#note_338224](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/note_338224)
* rename qviewer to tido ([405330d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/405330dcf7141b2d5add24279843a696b022348b))


### Continuos Integration

* remove entry point ([43cb411](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/43cb4116fedb5590bec5f6d3ca943f639762a8c8))
* remove entry point ([11f566e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/11f566ec5d30cba66f749b49571a5f38a26c3781))
* remove entry point ([aeae435](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/aeae43585dccb98e23010aacb10e443d6d5ba655))
* remove entry point ([ed943b5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ed943b5d96b8da65139a9576c05098ed82077494))
* use node 12 instead of latest for Docker ([61b0499](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/61b04998cad308b4f9874416825d1185b300f2cb))

## [1.12.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.11.0...v1.12.0) (2021-06-17)


### Features

* add padding to list not to overlap with FAB ([0db4c91](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0db4c9184adb9f952da39bc78707539db4793074))
* fab with highlight all/none ([463333d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/463333dd75e57b784d40cf24fbd08bea38fa1e53))
* fab with highlight all/none ([3ad837f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3ad837fd856e50a9ae4939590a74c95a19230291)), closes [#158](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/158)
* implement motifs tab in annotations ([f64e38a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f64e38a986af103ff27afa7c4ce7d4c9f475cd45))
* styled fab ([1aaeb65](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1aaeb6575f9a3200a5d5fb737e3716feacd0bf73))


### Bug Fixes

* closes [#275](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/275) by resetting the toggle state on text panel update ([6c6d888](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6c6d888af5e6d12e0ed2ff57ec32e67c76e62e0a))
* highlight all or none in respective tab ([2dae09e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2dae09ee1b70434eb327b51140b5cb6f17c3c346))
* last element not cut off anymore and list is scrollable ([766d4a4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/766d4a4a26dbf88ca3faccd3470dd2832ac97a1f))
* provide scroll area to scroll the list of annotaions wheever it excedd it's viewport ([fba060c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fba060cc0e11cb3e8aee0fa528ff293b5a690396))


### Styling

* accent color for floating action button annotations panel ([183ca40](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/183ca40ba77912191f9d132ab59d5f7ed164e994)), closes [#282](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/282)
* adopt the styling from the text panel (content.vue) ([e16bed7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e16bed7a91984af7b77ea02de315208bad214f81))
* basic "style" (fix typo) ([afaa1fc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/afaa1fca2b8f4150aef22a7a28923fa38b636dbc))
* changed color style to use quasar variable ([24b230d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/24b230de819a9c2a2629fa5e3096e36a12f0a022))
* improve index spacing of annotations in text panel ([d4ffdb8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d4ffdb8b44c1b9a5f8bd4384a250416fae64c66b))
* improve var name ([7bea027](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7bea0276573e7ccfaf923b03d1d48e4541536a75))
* introduce new folder for several annotation components ([8cf0e2f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8cf0e2f4c55f4f6b044eadd75df030e19dd7e6b8))


### Refactoring

* addressing review comments ([55d865b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/55d865b67a13f96db312390ae5427db3b2297159))
* annotation tabs have to be generic ([dcaad91](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dcaad915595117cfe0eee48adf7f56d25bc6462a))
* highlight all or none code refactor ([469e825](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/469e82563d6c5429da8916269e6d17cc35d70aa8))
* improve maintainability due to modularization ([594a26e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/594a26e8b48b2490c598fa33ffd5607f9af9c747))
* improvement: split the template into it's main parts (annotationlist) ([a44038d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a44038d4fb47b952dddd3eb161a536ea404b74a1))
* logic to add text class names ([5f9e3d8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5f9e3d8ab78fe2f4748234b3299afff420ea807c))
* provide a template for the upcoming annotation toggles to be treated in [#271](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/271) ([39a10d1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/39a10d146d498f675730f4f92c50a617659675b9))
* provide new component "annotationlist" ([9190f9e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9190f9e42b1e01241482525e9799b6845a1471b3))
* remove obsolete code ([28b9412](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/28b9412034b9cc94083616623cf309ef0a3ff315))
* renamed prop and added i18n to tab titles ([968ea86](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/968ea86834531ad46cb63d1829e4289f17d4a2ae))
* show notification if annotations aren't available ([fcff762](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fcff76247efd9c4d378366bb9460455138657b6a))
* wrap text elements to if condition ([1d62df8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1d62df898f8a776cc8088bded87868965a2b55f2))


### Docs

* add docs about stages [skip ci] ([e775784](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e775784402e02e4468720cabefcd3a4d8cbe82e4))
* extend docs for ci scripts ([65c3b9d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/65c3b9de4a34469665d0eb7835395f8bc44fa83c))
* update README according to the changes in the congig object ([289ad26](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/289ad26a8848685face17b1586599916fb425a57))
* update README in regards to annotation type configuration ([3e7d78e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3e7d78ef90c59137bb5ce6312f1770e4d27799de))
* updated read me ([86ad976](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/86ad976cc2342f2cffbfbb0d5b025589a8032bb8))
* used suggested translation ([e42d087](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e42d087e329785922297aece832fb644c8dce85d))


### Continuos Integration

* remove entry point ([2a7b302](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2a7b302e6708978eea73f88c9db33fe44eeab534))
* remove entry point ([27d5fc4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/27d5fc472ac11873b9d6558d19e52b04ce99b214))
* remove entry point ([aabf429](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/aabf4294af609dd14fb7f79871814f2ae4dd8c3e))
* remove entry point ([bfff14a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bfff14a3ccafa41adc5d175c34e6d148db40136a))
* remove entry point ([579b690](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/579b690e6db85c6953122892023663c0184b07e2))
* remove entry point ([f722a02](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f722a025e8c8ca5523996b380f631c9270cf4428))
* remove entry point ([32d1ac8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/32d1ac826565fbcba43f04dacbcaa099eb2d2937))
* remove entry point ([f6ec55e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f6ec55e725e189e40bc09ed486b2eddeb3f1e367))
* remove entry point ([cdf6950](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/cdf6950b650bf745486e1fdec2c0f993f79a1e98))


### Chore

* add entrypoint for dev ([888025b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/888025bc2e5d94fbe0edc23a53008f1bef45d0fb))
* merge branch 'develop' into feature/[#272](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/272)-annotation-motifs ([3596ab8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3596ab87b5433f51971611f381f7cb9aab9864a4))
* merge develop ([ecceda5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ecceda51e109913a14cfc348ff740239ea894194))
* relabel toggle buttons ([0a1df8c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0a1df8c18fa660e213dd5d992510d5d022fe151b))
* remove obsolete style block ([b1a9996](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b1a9996201bfa622ca00ef5927d677ee75b5071e))
* typo ([3ef43aa](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3ef43aa0f0ad288179fafd7da3830e59567aa430))
* wIP: try to tackle last list item which is still cut off ([89e018c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/89e018cbf0b7dc4dc17f166d2e4abfb09afbc99a))

## [1.11.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.10.0...v1.11.0) (2021-06-01)


### Features

* annotation panel shows annotation about current text type ([e6a3602](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e6a36028375dd961d61e54f8ea89418033973458))
* default not highlight anything ([29155db](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/29155dbcab0e98ba4878995a31bbe170ffcba544))
* implement links functionality in annotations panel ([385244d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/385244dbee2d58b7ed62d52a7117aa73e23a8004))
* to display a notification message if there are no annotations ([9482003](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9482003e0e1b65ae4bf75bf6c5fd55132dde27f4))


### Bug Fixes

* refactored the logic of updating the annotations according to text types ([0b35918](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0b35918baccbcd933b49df9591645d7fee31d416))


### Styling

* adjust index size of annotations in text panel ([fe55b46](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fe55b46c44c4c818afc3b6dfaa0dab2827e30671))
* adjust padding in tree view ([9ce0393](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9ce0393cd6d3c0945b24c4faaf1efca1e1bca913)), closes [#255](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/255)
* clean up panel toggles style ([df3fec1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/df3fec110586857f3eaf2e98ad668a3d515fe83f)), closes [#258](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/258)
* mark annotations in text panel ([b2bc222](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b2bc222e8034419ea4ac77da33a67908073029c0))
* save space in annotations list ([72a1b7d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/72a1b7dc616c8cdc3b81ccdfbc6a940f379f1e45)), closes [#261](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/261)


### Docs

* adding explanation about linting exception ([045f616](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/045f61645ae38c6e0ec773757ac77cc6ae7352df))
* updated text according to review comments ([f102078](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f10207842d159f211e4a38cc3181590685f75011))


### Refactoring

* changed notification title ([e684c2d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e684c2d50e1e6bbac9ee704dc2ee1fb8986040c0))
* move misc icons when header string is deactivated ([a56ec22](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a56ec22ea868a05b121d1c14c3214fcc5b15a70f)), closes [#264](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/264)
* refactor smallcaps css ([3e7959f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3e7959f18b48f5c3dccfce6670d97dc24fad660b)), closes [#259](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/259)
* refactor TogglePanels ([45fbe13](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/45fbe13f3b4930b78dcd5c8bb00662ae79a484cd))
* updated style and added language change ([b85828a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b85828a0019bbd7c67b4ab3b0e52ace493f6f9a2))
* updated text style according to review comments ([7e6a20d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7e6a20d471c3252dee4324aaa75a2c6fdd84048c))
* used camel cases ([cb73038](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/cb730382d745173c207252d95e8aab440c42c362))


### Chore

* merge 'develop' into feature/[#237](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/237)-annotation-links ([61d3cd4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/61d3cd4b048af2d24fa23cac3a18f1f5811ff71a))
* merge branch 'develop' into feature/[#257](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/257)-notifications ([dd589fc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dd589fcc512893c3369a74e54c8d8a75bd667803))


### Continuos Integration

* remove entry point ([0142122](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/014212243efcb80437c8322349054b704cb63abe))
* remove entry point ([3c63129](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3c631299509c1d8c30b66667588ab43ff2da03bd))
* remove entry point ([4cdaefc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4cdaefce6ffc2a5ed00d04711ceaa32f326366c3))
* remove entry point ([0621347](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0621347e73b9f44f632c57f8af12a3eb4421b8ab))
* remove entry point ([5e9afc2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5e9afc2699919171f3cd048076f1ba6761b996bc))

## [1.10.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.9.0...v1.10.0) (2021-05-12)


### Features

* implement multilanguage-German, add tranlsation, config ([83e62c8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/83e62c869dff6681517794060a1cad02097efc84))


### Refactoring

* add tranlation for sheet and addressing review comments ([007d7e0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/007d7e0b5b127ca867724ecf2bcd7c59a0b97a09))
* add tranlation for title ([c8209a1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c8209a1c9d8dea98969495efffe628bc1be22e83))
* changed de to genaral way and added statement to readme ([c3cabff](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c3cabff60962e8acce7f02fba8e0daefcbea30f9))
* fix translation to icons in image panel and added parameter to make default lang ([7b4bdb8](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7b4bdb8bf6625742c5cd01da424cb84b93226f3c))
* renamed copyright ([ccf2190](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ccf2190f8f352833861869286ce44251d506edc9))


### Styling

* consistent border radius for hover items and alike ([40db4bc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/40db4bceec6f3014925467981b5ebe343a7d2e0f))
* make tabs in various panel look the same ([9cfa574](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9cfa574431da94a4c694a6aaab3d444d53867d99))
* panel title style polishing ([99ce6d6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/99ce6d6ebcab41b91d5b5bb8420489658675b453))
* style links in metadata and similar places ([3613876](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3613876a3226f88b4ee94833a9eb934110d5efb8))
* style links in metadata more like Quasar likes to do it ([80f9295](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/80f92959d9f2fdeece04d8101e03019f8e5f4343))


### Continuos Integration

* add entry point for testing ([b872a41](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b872a417fe9ad22ac25672b726ed60fd7af2a3e6))
* add tracing ([252d8fd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/252d8fdfaec45cf89431372ac4dbe8ea8dfed36d))
* only add new directory to artifact if build isn't canceled ([5dab803](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5dab8036b530c596304a624ea0b9e2e9c825f25d))
* remove entry point ([0e1fd14](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0e1fd1404dd73d71aadb2fa0f23c48607d4ae8b0))
* remove entry point ([09389b3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/09389b3f974f802113c4c6998e28e1db94b7572a))

## [1.9.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.8.0...v1.9.0) (2021-05-03)


### Features

* add annotation highlight to text panel ([a17bd7c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a17bd7cb41701a5e517c8cd8272ca75306a62ece))
* add basic configuration for annotation panel ([8a6239c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8a6239c52b55f965a454207f1622708b41a2d791))
* add empty annotation panel ([9996d92](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9996d9267bf1c84f756ff8d43c54d44606e300bb))
* add icons to annotation list ([483b771](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/483b77178e467abd7d8a80fe7f5a3d13170c61b0))
* allow 2 and 4 px values in CSS ([8cbdba1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8cbdba19b8567149d7b6a0031ab53222d1c01571))
* completely added annotations panel ([91864dc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/91864dc7d1e7d4c0ad5e48fff770a4fdccb9ff85))
* configure to show either of the panel toggles ([ccec6d2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ccec6d28f9871aea15c19d5294837a2b1fa7b196))
* create reusable urls component and implementing links in Metadata panel ([0d809e9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0d809e9968ba6c8edb5905c5e13dc088641fbc21))
* getter for multiple html content serializations ([8ba887d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8ba887d86a493cc41ea5c1fb8c167b2b230bd6a4))
* harmonize object keys ([4bd9dc1](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4bd9dc1ccb5c12cb1f2a6f8242f2bc695f9895b5))
* move annotation data handling to component ([29fa9b5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/29fa9b5a1346eee7434bdab6e7123289a02726a8))
* prepare getter for annotations ([9db4bde](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9db4bde8079c0049c1f8dc680524786f47e74169))
* remove getter for annotation body text ([7325b1a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7325b1a2427e198a4f3a528582a2dc8a5fe1f8ed))


### Bug Fixes

* adjust panels and display content according to screen size ([6e77418](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6e77418f9cc56c4d6309d25b9f16e8ad5620e9d0))
* css syntax ([00aea79](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/00aea79b4c64d5d10e6a8c22b62d2e40e63d4af9))
* make annotation list full-width ([08da9fe](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/08da9fe252d3845107ea1383a5d2122723008dde))
* no-console ([c2157b6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c2157b65e993b53b157f573aefe00e021ef20200))
* overflow added in mainview ([a1e64d6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a1e64d6beb3d95c8e6e2f1d48d04dcfb727d4e7e))
* overflow/scroll bar issue ([3bc1475](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3bc1475612f9bcf6fa9da9f5a547e1d6314f4aab))
* set scroll bar at treeview ([bcb0ee9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bcb0ee93b1439f2192d5d2b0817b616e8ef7b170))
* syntax ([ffaea9e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ffaea9e2d4db4d72478c5f061b7b180af312f610))
* typo ([5489f23](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5489f236d957637c8509171d148bedf9965c3c48))


### Reverts

* re-introduce drop-down for panel toggle ([861467a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/861467a0407fb0eb20e9d5c5cd62ab3ca21dd687))
* Revert "refactor: moved drop-down logic to same component" ([072762b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/072762b4b3611c1dcecbf9bab7f2c833e2744461))


### Tests

* add entry point for testing purposes ([7deaa3e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7deaa3ef80ce7d62f3a597f5ba3ecdc35195fcf6))


### Styling

* add no-padding ([8dcb61a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8dcb61a244f82691d6aa45195744cf581a8d443a))
* added a style class in metadata panel ([a55825b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a55825b19d279c378813617da33fd0a96b190f0e))
* adjust index colors in header ([323d5f9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/323d5f9906264d60fd6ff4189e0efea9bd3f6484))
* don't use CSS style ([6035fb7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6035fb73c7e162a0bf43b4e0ddc44c55be833028))
* reposition icons in header ([a195f90](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a195f90a9d269e8f3822262741c860238625ed0f))
* save space in metadata panel ([45581fd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/45581fda3b04ec9562399abfb916dd414626abb8))
* save space in tree panel ([0cc9115](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0cc91155fdfcf7c033585d20522efe6813ba0c89))


### Improvements

* hide the reset button when TIDO is configured to not show any toggle at all ([2ae93e9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2ae93e9389400db7c847adedd09e003d98a4fe8f))
* switch to quasar color class names ([d7d5963](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d7d596369eafdcb168bdb412756a2c21febb36a5))


### Docs

* adjust README.md ([c9c6332](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c9c6332cee2ca731816f47f0c32f84e9d303dc27))


### Chore

* adhere to consistent camelCase ([49e3921](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/49e3921bb69ec10a5178c8c31e4536198d645a68))
* condition statement ([df1a41d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/df1a41d3abddbd30145f8bcd66b35562c0c733c4))
* improve readability, order methods by alpha, refactor some parts to be more JS-ish ([e2c0bac](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e2c0bac709bb15615c3c8a6c30199a77bdbd2c6b))
* merge branch 'develop' into feature/[#194](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/194)-links-implement ([a2639eb](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a2639eb3508b957dd5c172ad6c2b85baa4d14ea2))
* merge dev state into feature ([6ec8900](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6ec8900b78494549cc67c9e3093c339aba9954cc))
* move [@style](https://gitlab.gwdg.de/style) to css class ([cd4b0a0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/cd4b0a043b188081464b80cf994b8b5214402e13))
* remove entrypoint ([7dfaddc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7dfaddc5c62c030eb8179b5d4365aedfd9c21e03))
* remove TODO after discussion ([134bf23](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/134bf23684b4b75530dd884d545926cd32ca403c))


### Refactoring

* adjusted color back and removed entrypoint fromindex template ([a24b74f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a24b74fd8fffc1b7ae00bab369e2a1e7f0ee1b25))
* adjusted header toolbar and styles ([4ac6be6](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4ac6be6d00418a29976f67d4ec41c701fd303842))
* change print command ([f2ba241](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f2ba2410a331da9c01a175327b9d52cb381c723c))
* consider linting ([1195cac](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1195cacb58ae8cbd5420005531f7a7484638ee75))
* consider linting ([ee6f3ab](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ee6f3ab02cb5da2ca6fc722f54eb3a8fa6e98acc))
* refactor language and added a space to links ([b59b04e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b59b04e1303df6c2ad0b3dfab0db9e393324c546))
* remove dead stage ([95ec4a9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/95ec4a9a838c4e8f52d624062e3d6757031c4f7d))
* remove space character inside span ([4f36341](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4f363419470f1bc2a59c85f12a4ca0af04f7baf7))
* save space wherever possible ([4fdd5ea](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4fdd5ea09fa3c6724c16f1aae87ec1ed95dbbcd4))
* updated styles to make scrolls work back ([36ae6e2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/36ae6e24c91a9c77695f7618e4d8d6d7b37055ae))
* work-around to display useful text for links ([87ff816](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/87ff8166e32bcad9dc8fc0fef516ff2ae254f9db))


### Continuos Integration

* add draft for cleanup ([ed2bc1c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ed2bc1c1c44d59bf8b836e5d15185791ce0c01e7))
* add script for 404 page ([a1f139b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a1f139b65c469493073f262de34159552ae0a04b))
* add set up for removing entry points ([9d49446](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9d49446bc316323e47eec0dd24fe3d7cc6aa1036))
* add template ([3aded7e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3aded7edc7cfb14e7ab01290ec2befe6ebc5a55d))
* add variables ([40b251b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/40b251be8e6888f8e29e35d0eb9d43696d23599e))
* execute 404 page script on demand ([8923335](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/89233354cde0b98fe64ee7425474b917c297e7b7))
* move scripts to separate dir ([acef885](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/acef8854fc0cf9f7235bfada7bbae3e29888660b))
* move template to script ([45ad009](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/45ad0096301e258e08368030d99883ff7077dd53))
* remove entry point ([61b2923](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/61b29236169b47248b828bc7beb73a451ad6d493))
* remove entry point ([7d06f99](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7d06f99a5ea85eed6fa1c8f3749f8b61d51bbba9))
* remove entry point ([600d094](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/600d0941531c35d82993a0f02bd0e836fc748a2a))
* remove entry point ([da24152](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/da241526964f6fabbd9dcd0142024d01fd3dcebb))
* remove unused data ([8f23173](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/8f2317344fa3d7d7a439614401b394e9f518e561))
* restrict clean_up to develop [skip ci] ([1916959](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1916959b2b133c38ecf45663a4e79702d68b0f2a))
* set expiration date for development artifacts ([4f991ad](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4f991ad31e1ae6467c028fdea209abfec0e4eaf2))
* switch to image that has dependencies installed ([5c41768](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5c41768939f674f32d6ba9acc0354b38477ebb81))
* test replacement ([1def71d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/1def71dca9aa0756dbabcac39dbd231c68ffe46c))
* update Git user mail ([943fec7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/943fec794705fae0b8442ea694729e00f6433e34))

## [1.8.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.7.0...v1.8.0) (2021-04-01)


### Features

* enable TIDO to display more (+n) text types as tabs ([21df73e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/21df73e17da5210580a6bdea7baa8d5dbebc788f))


### Styling

* consistify styling ([dd3e07d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dd3e07d9af968072724e98c8d51d4e24af185100))
* un-hide scroll bar in text panel ([dbcc7fb](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/dbcc7fb4523a0ae2aa04920a2a13cd55f9cd5f23))
* un-hide scroll bar in tree panel ([119ee00](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/119ee002d5f765c1ad514856b275a821d13eb445))


### Refactoring

* addressing review comments ([02fae63](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/02fae63bfc6ba2cdcbb8de2d43b5784dc7e2c153))
* display/show the text type and not make it clickable ([91ff031](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/91ff0315d316e705d0722f78f7567902c586b688))

## [1.7.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.6.0...v1.7.0) (2021-03-10)


### Features

* adjust content type/s according to the recently introduced content key from the API ([5c946fc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/5c946fce6d9486e009441f11089aa138c12c1e3a))
* filter contenturls according to a matching mime-type "application/xhtml+xml" and "text/html" ([ffcb7ce](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ffcb7ce5196098952328e3b213a0a0db875bd0e8))
* implemented Tido to add css styles from Ahikar ([a46ac66](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a46ac6680116ac76bc98a7f4742dd32fb5cbb3c4))


### Bug Fixes

* refactor logic to fix subject array list ([9d2c5c3](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9d2c5c31ee45680a95baa509ca3aaab9d8b03d8e))
* warning bug related to stylesheet from support obj ([a592b9b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/a592b9b23ecc5107343c019ed7adfa0c1278beb9))


### Chore

* add basic unit test. to be expanded ([418c6ba](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/418c6ba95c5701b7cb3b1c18236bcf0b8f8dc217))
* adjust unit test according to the change of the datatype ([9be7de2](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9be7de257e671d934c7add46305d8e5136af7ff3))
* remove entrypoint ([03f95f0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/03f95f0319e91a752f020dec0cba331ae2480a71))
* remove log stmt ([2cfde38](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/2cfde380b2559894b5201c760a94f2c8cbf2871f))
* remove obsolete property "language" ([9313da5](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9313da5549c8a3650981a971e16128aec6638030))


### Refactoring

* refactor support logic according to review comments ([73c04c9](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/73c04c971d972ca78bf6394c4d321755161ff59c))

## [1.6.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.5.0...v1.6.0) (2021-02-23)


### Features

* provide and render metadata object according to API specs ([c93ed76](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c93ed76044e07bafba7cccbbae67318e3062e3af))
* provide data structure with mandatory and optional fields for all meta levels to keep the markup lean ([29edf1b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/29edf1b5742f00ebfd31aecbb02c5c7f866f2c31))
* provide mixin refelcting mandatory metadata according to the specs given ([b328c87](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b328c877697104b49d2285d7a5da7c80046bec44))


### Bug Fixes

* license for the text part; remove comment from the metadata and rename TiDO to TIDO according to review ([375aa9c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/375aa9c791e5d9b3c18e13ae908c858858f5e909))
* remove all obsolete config options regarding the metadata due to refactoring. we didn't agree on what to configure yet. ([57f3e6a](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/57f3e6a1e6909762ea69d1e1531060fe99c3798b))
* remove colon and entrypoint ([d7c05ee](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d7c05eed2a37ecfb4238c9fbdfc96f80afb9f0f2))


### Chore

* debug & prepare data for matching ([636bc78](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/636bc7818f3827eeee55a478f5a1fb3d9e7a70cf))
* rename core component to TiDO ([4381ade](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4381ade9ca3148017135a43b042394cad02e9660))

## [1.5.0](https://gitlab.gwdg.de/subugoe/emo/tido/compare/v1.0.0...v1.5.0) (2021-01-28)


### Features

* ability to write a changelog ([3a42097](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/3a42097f18165ece0f9f263a77c5ca5a67db1572))
* enable project specific text styling ([ae7202e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ae7202e4905eccd78071067e54683e0f8a22b391))
* refactored sytles of toggle bar. ([28f3a04](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/28f3a04c7d6097c88845d640eadbc43105169b1f))
* reference correct repo URLs ([6e0477c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6e0477cd7d80599d3fbd114451126edb6c5c3536))
* release our viewer via npm ([861d3d0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/861d3d067df7b1c3c128d995383b63c0a081c80b))
* release: resolve conflicts and merge develop into main ([74b7247](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/74b72473c978129b8166e7b24250dd04eb235585))
* trigger update on downstream project ([0f048fb](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/0f048fb63c9eaa87932b7e1bb0e20c632570148e))
* update Ahiqar repo name ([4d3445b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/4d3445b55ada2fc686dd5ab4043cde132e4709fe)), closes [#115](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/115)


### Bug Fixes

* add missing package.json.lock ([821d180](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/821d1804392c60199cbacc0630a5548a5f77742b))
* Addressing review comments and a11y. ([d3a7c5d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d3a7c5d3d993c876e256d31a9f1eb9544d33c89e))
* display meta items only if provided by the api ([ab15468](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ab154687df711aa1ffb6306cb454832cfec430c1))
* fix displaying of single manifest ([d71c467](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d71c467c1baa5a34abd5aa10054fa0a5fc6c81ad))
* fixed the bug regarding metadata and refactored OSD stylings. ([41f6c06](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/41f6c06a71d107314eaad8af7bae1afea3f93b12))
* Fixed toggle buttons disappear, anchoring manifest title to top. ([928be0d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/928be0da657890c85ec17b7d2f950dcf66c72c4c))
* gitlab CI syntax ([10fb37e](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/10fb37e75a00875880bac80fa37e58c9db425a9e))
* make css classname understandable ([ce1ea7f](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/ce1ea7f053cc4efabc7c427773a9bc18b3766406))
* patch the entrypoint for the Ahikar demo / dev branch ([b0fe3db](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b0fe3db7d37426b1cc900ead319e500fd6cfb775))
* Quasar's helper setBrand requires two strings as parameters, hence we should leave the config object with an empty string to disable it ([bc34791](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bc3479143053d58a9570b75e0827d74ddd8bde01))
* remove obsolete css class and fix code hint from json to js in the README ([8752731](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/875273183dbe898795ed90cc9175e2cbea22b356))
* run npm run fix with pre commit hook ([58f6453](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/58f6453c727c6f84af7d742d9b771a95109845ce))
* upload missing file ([6b89854](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/6b89854acfb314af0a1ceb3973aa63d41ca79cfc))
* upload missing script ([e9f755b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e9f755b2a725d98982fad2ab393ac692c34843e0))


### Docs

* add (S)CSS coding guidelines ([e47485b](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e47485b81c650b5084f5692893c7885560e68b56))
* rewrite connector config; refactor: eslint-disable-next-line; switch back to test server (index.html) ([74b8f52](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/74b8f522e3f395efc710fac2a1041854adcce9f3))
* update CONTRIBUTING.md with notes about the usage of husky and commitizen ([9c19ddb](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/9c19ddb9d05c709f2c3e4b829037f60529ea764d))


### Refactoring

* addressed fixme comments. ([fd1f696](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/fd1f696f50ea97584f8c82dcb5da3022a3127839))
* deactivated customize buttom from toggle bar. ([6473034](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/64730348fc0a28d6a2fd3b709e53a40047920bf6))
* moved tree scoped style to new file. ([15734cc](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/15734cc9c6107d74f1c0aed9c8cf26583dc63b76))
* npm run lint and fix scripts ([c956e32](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c956e329a192c1e2c3060c15bd7f01994cb18948))


### Build System

* add pre commit hook for linting, fixing and testing ([b4d756d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/b4d756de677831d0d48158af63242457bcd1bdd6))
* improve styleint rules ([bd573a7](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/bd573a7beed69901049b86cab307f2b860609829))


### Continuos Integration

* add .gitlab-ci.yml ([e7dd59d](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e7dd59d8c3fd80b18e29f87346befdb8fc7a0fb2))
* change branch which triggers ahiqar-tido update ([e03333c](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/e03333c9942458544d5d7d2f50575d309de6baba))
* fix typo ([7de35dd](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/7de35dde1533f19fd9593f66121f73f66e569b08))
* keep main and develop artifacts ([c8f65e4](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/c8f65e473c30fc7ee5a2288b050b0495c4348fa3)), closes [#55](https://gitlab.gwdg.de/subugoe/emo/tido/-/issues/55)


### Chore

* add stmt to CHANGELOG ([d679512](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/d679512f008b1e681810dd7ac56b76302f4295e9))
* remove unnecessary passages from GitLab templates, add passage concerning README ([f75c118](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/f75c118aedf02000ae6a09988e9f0f1ae3f58476))
* revert index state and adjust quasar.conf according to new product name ([71145a0](https://gitlab.gwdg.de/subugoe/emo/tido/-/commit/71145a07741ff6a5b6aa777dd7892cce168854c5))

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
This way we ensure that <https://subugoe.pages.gwdg.de/emo/tido/develop/#/> always works.

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
- added titles in the footer for Language- and Info-index

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

- toggle fs index on fullscreen change

## [0.0.1] - 2020-05-14

### Added

- This CHANGELOG file

### Added

- Pages deployment on per commit and per branch base
