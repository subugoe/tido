# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [5.0.0-alpha.18](https://github.com/subugoe/tido/compare/v5.0.0-alpha.17...v5.0.0-alpha.18) (2026-03-04)


### Features

* add onReady public API when data are loaded  ([9ecb73f](https://github.com/subugoe/tido/commit/9ecb73f48e9a69cab3ee72293dfc7bc18654045f))


### Bug Fixes

* avoid unnecessary collection requests on panel updates ([d844728](https://github.com/subugoe/tido/commit/d844728dad0a771ce34a36a8a474430411ab12cf))
* debounce annotation filter checkbox and perform safer updating of the state ([5a746a3](https://github.com/subugoe/tido/commit/5a746a3056b5a1cba55ad7d62768f6db3846cc2a))


### Docs

* add CITATION.cff ([6b028dc](https://github.com/subugoe/tido/commit/6b028dc462e879777f0e7d12aaf97fca5ea640c5))


### Refactoring

* fix TypeScript issues, add typecheck command ([bd945b0](https://github.com/subugoe/tido/commit/bd945b02494f82ed1da132386c20e120d6d9cdf4))

## [5.0.0-alpha.17](https://github.com/subugoe/tido/compare/v5.0.0-alpha.16...v5.0.0-alpha.17) (2026-02-27)


### Features

* add config for annotations mode [#929](https://github.com/subugoe/tido/issues/929) ([93afb76](https://github.com/subugoe/tido/commit/93afb76d516875d7bd77b9240a4d0daee5ff8c68))
* add extended split views, remove old panel modes ([94231f7](https://github.com/subugoe/tido/commit/94231f74e81c3ecd2ee93e484e5e17c35fbbc5dc))
* allow using IIIF Images ([00690ea](https://github.com/subugoe/tido/commit/00690ead1db8abc9914ac6e921193e9443d0ec1d))


### Bug Fixes

* discover content types for text without config ([f0c1a59](https://github.com/subugoe/tido/commit/f0c1a59c66b7a96fbe6aa702eae8098639708415))
* filter variants correctly based on witnesses selection ([96aa5dd](https://github.com/subugoe/tido/commit/96aa5dd80c2f1514fd61d41e7fd7711d105f840f))
* fix alignment of annotations ([f41ce8f](https://github.com/subugoe/tido/commit/f41ce8fec322912c57f5f69b6a0bf4d67d52f237))
* fix removing text hover style on mouse leave ([750f45b](https://github.com/subugoe/tido/commit/750f45bdc7536ab3053dd111c71f871782624de2))
* fix switching content type ([b9e8302](https://github.com/subugoe/tido/commit/b9e8302082ecfec5516d4a05260bf6e6f4ff7ad0))
* prevent circular matchedAnnotationMaps on empty local map update ([a5359c3](https://github.com/subugoe/tido/commit/a5359c31b090c13c62d08bf6f7848d42df8aec71))
* reload texts correctly at toggling with a selected annotation ([59a9fd4](https://github.com/subugoe/tido/commit/59a9fd4dabba9c09e60d7695d9acaa71f04138fa))
* show "Variant" annotations again when checking the filter if no filters config was provided ([89cb34a](https://github.com/subugoe/tido/commit/89cb34addd25a9dab98e90c6dc8ff7ec7135dc22))
* update annotations when a view is toggled ([15c2cd9](https://github.com/subugoe/tido/commit/15c2cd98c4ea5da1361f6eabba79c59b34caeb32))
* update colors of selected and hovered annotation in the text for better contrast ([9b0574d](https://github.com/subugoe/tido/commit/9b0574d34506d96c51beb033628c8db8a416b842))


### Docs

* update README with AnnotationsMode config ([#942](https://github.com/subugoe/tido/issues/942)) ([90619cf](https://github.com/subugoe/tido/commit/90619cf09b802e3b8e958c6d2584569258cc709b))
* update README with panel views config ([4e4b070](https://github.com/subugoe/tido/commit/4e4b070dd07b451fd2775d38b2c697c8ec225b9f))
* update toc ([ba6d187](https://github.com/subugoe/tido/commit/ba6d187e4a44b6b37b8237877e83b26d17583dcf))

## [5.0.0-alpha.16](https://github.com/subugoe/tido/compare/v5.0.0-alpha.15...v5.0.0-alpha.16) (2026-02-12)


### Features

* add handle long annotations ([1f0f665](https://github.com/subugoe/tido/commit/1f0f6651e67a41faba9ebdabbc3e1876566802f6))
* add scroll to selected annotation on target click ([c7adcf0](https://github.com/subugoe/tido/commit/c7adcf0ad594c758287f4aa085b45818936a6beb))
* implement annotation filters with configuration ([94ff3cf](https://github.com/subugoe/tido/commit/94ff3cf85c215a3ea8715c287ba156fcfb2869a9))
* use secondary color, update muted and accent colors ([2e83d83](https://github.com/subugoe/tido/commit/2e83d832f146ada95f2c7a000f169a5eaa111684))


### Bug Fixes

* add scroll to annotation filter tabs ([f01714f](https://github.com/subugoe/tido/commit/f01714f44e0e9024a9792f84a633444d7024c0c6))
* enable scrolling of sidebar in Aligned Mode, disable it in List Mode ([0ab20e1](https://github.com/subugoe/tido/commit/0ab20e1e8a5a1f25ab8307818574f4e48d6adaff))
* fix checked state issues at annotation filters ([70b5731](https://github.com/subugoe/tido/commit/70b5731fb7b90f05d07dcfca43046ef6d5ff027b))
* hide global tree after collapsing it to prevent interactions with it ([8301b0c](https://github.com/subugoe/tido/commit/8301b0c970ea0f09bf797f55696482d3b9111b87))
* improve annotations config validation, hide types display when there is only one at filter node, set width fit on filters popover ([189fcb6](https://github.com/subugoe/tido/commit/189fcb624d60efdca23247c8231eeabcabed304b))
* remove bug with next manifest button ([5da0fa7](https://github.com/subugoe/tido/commit/5da0fa779707d42cc2924d87887e75a0667e40e1))
* remove faulty indentation of annotation filter items ([5a14cc0](https://github.com/subugoe/tido/commit/5a14cc08029e206fac7264a7f9c2be7dc2c9c047))
* scroll accurately to any target (nested or not) in textContainer on annotation selection in ListMode ([c45c6a6](https://github.com/subugoe/tido/commit/c45c6a66f7266850bf859e90f4b75e5cd9ba0f5e))
* set fixed width to annotation filters ([626b2db](https://github.com/subugoe/tido/commit/626b2dbc9253241b6410142a64d9a7f058d27c9d))
* show correctly image when switching from text to image containing mode ([d0deafc](https://github.com/subugoe/tido/commit/d0deafcedf28dd87055335e4aee88fb86a8ecbc4))
* update unconfigured annotation filters on item change ([d098f86](https://github.com/subugoe/tido/commit/d098f86bb36ca1cb6d2180b8839d2471b0c8b8fe))


### Docs

* add annotations docs to README ([2f59877](https://github.com/subugoe/tido/commit/2f5987701732e7db8b5b6e4979d3fbd0be74db27))


### Refactoring

* fix and refactor some minor comps ([d41907f](https://github.com/subugoe/tido/commit/d41907f9cea3f9b6aa7198cafca3227d71477b3b))
* include start and stop scroller in AlignAnnotationsList Component ([9bc2675](https://github.com/subugoe/tido/commit/9bc2675993709fd0b02a52b84ae62728b9c9f169))
* use "aligned" instead of "align" in annotation modes, update README ([da96da5](https://github.com/subugoe/tido/commit/da96da5d7913191ebd6de8593cdeb55da4570511))

## [5.0.0-alpha.15](https://github.com/subugoe/tido/compare/v5.0.0-alpha.14...v5.0.0-alpha.15) (2026-01-14)


### Features

* add nested annotations and allow (hex, rgb, hls) values to primaryColor ([35f677b](https://github.com/subugoe/tido/commit/35f677b303779db0d3d5533e9578d972d994936c))
* add oklch format to config value for primary color ([3d4d3f1](https://github.com/subugoe/tido/commit/3d4d3f1c9ee08ac14773a61b39d2152190480599))
* allow "target" attribute at text sanitizing ([cb1c80e](https://github.com/subugoe/tido/commit/cb1c80e601d4c0a40d04a3a51af52b0fda7095d5))
* extend TextAPI item validation ([8473364](https://github.com/subugoe/tido/commit/847336438edb9c02343714d1e3af838a7621e136))
* redesign panel header to be more compact, add manifest navigation buttons ([e7ad8f4](https://github.com/subugoe/tido/commit/e7ad8f4230aa3d20769830fbf18afb59dcfe35bd))


### Bug Fixes

* apply default annotations mode from config ([4e30c9d](https://github.com/subugoe/tido/commit/4e30c9d5166436be3926853f041277f2a4bc61b6))
* text view loading spinner position ([a1efcb2](https://github.com/subugoe/tido/commit/a1efcb25a5efead44e93799eea73d5f6fd0b1377))


### Docs

* update README ([60f2e3f](https://github.com/subugoe/tido/commit/60f2e3fe7af72e929b454185497d582b54b7f122))

## [5.0.0-alpha.14](https://github.com/subugoe/tido/compare/v5.0.0-alpha.13...v5.0.0-alpha.14) (2025-12-16)


### Features

* add close panel and retry buttons to panel error ([5d1ec2b](https://github.com/subugoe/tido/commit/5d1ec2b3bacd859577ca1b453aed48162badc00d))
* omit content type in cross ref popover when there is only one available ([ac40423](https://github.com/subugoe/tido/commit/ac40423d9035b67a80724d83a989ec1ab9a2bc7d))
* switching to new item should place text scroller to top of text ([5cbe7d2](https://github.com/subugoe/tido/commit/5cbe7d25bb7efeeefe5dfffda25c64558330e88b))
* update panel config by using manifest/item IDs and content type values instead of indexes ([361184b](https://github.com/subugoe/tido/commit/361184bc7268fbafc4b6e60af96d8a85076937d8))


### Bug Fixes

* add loading app loading spinner ([32de5c0](https://github.com/subugoe/tido/commit/32de5c00e09643d216e9f30e0cd4ee8e7bf1eb18))
* fix image view width ([c65888d](https://github.com/subugoe/tido/commit/c65888dc9a216f9373a1ec4ef1823ecc1ba8d404))


### Docs

* update README ([cf5e73e](https://github.com/subugoe/tido/commit/cf5e73eae1f85a0147b10ed1350a3002ce0851f7))


### Refactoring

* reorganize ConfigContext by initializing app in a useEffect and call 'mergeAndValidate' without a promise Cache mechanism ([5b29828](https://github.com/subugoe/tido/commit/5b29828fcf194d5259c1d3d6b47a1b5299548267))

## [5.0.0-alpha.13](https://github.com/subugoe/tido/compare/v5.0.0-alpha.12...v5.0.0-alpha.13) (2025-11-27)


### Features

* add selections marks in tree ([bafcc79](https://github.com/subugoe/tido/commit/bafcc79e931781e909ee05496bfd5e77e30fc83b))
* add sidebar loading state ([063fba2](https://github.com/subugoe/tido/commit/063fba2231b1be463ae6272b9de2200293ef3039))
* make content type display in cross ref popups translatable ([1480e7c](https://github.com/subugoe/tido/commit/1480e7c80a24cc21a7cb9334826d24ee9d08b098))
* scroll to text target when selecting an annotation ([e947662](https://github.com/subugoe/tido/commit/e947662c2a787a7852fccb3449988e5cc051a827))


### Bug Fixes

* align vertically the 'opened' icon in tree node ([e7e9646](https://github.com/subugoe/tido/commit/e7e9646668a1d9d2de71b2c95352c0b0259a4db2))
* diplay loading in cross ref popovers correctly ([d8aa3b7](https://github.com/subugoe/tido/commit/d8aa3b70ef05f7a8d3bdd994c6ef3602a20375ea))
* panel label resize dependant on main pane size, not on whole panel size ([054bd9c](https://github.com/subugoe/tido/commit/054bd9caee73f43c8e3f5a69d05a824e07f9dbdc))
* prevent overflow of content inside tree selection ([af75ba7](https://github.com/subugoe/tido/commit/af75ba78a18396928ac150123f6351009105e284))
* render inner HTML of cross refs as HTML elements, fix opening different item in same panel ([312c41c](https://github.com/subugoe/tido/commit/312c41c56870069756fd977bff26a8a1e17447cd))
* reset sidebar view when switching items, improve sidebar error handling ([1d37856](https://github.com/subugoe/tido/commit/1d37856365534c7881521fd71bbb45ebe4b15725))
* show better error message for wrong collection URL ([64732b5](https://github.com/subugoe/tido/commit/64732b51e94458055aaba52057850ef16d9158b3))
* show cross ref in cross ref nodes ([41fd6b3](https://github.com/subugoe/tido/commit/41fd6b3f27ea6989fff38c82215282d5d7a11414))
* update tree node tooltips and styles, set selection mark color to primary ([b9b41c9](https://github.com/subugoe/tido/commit/b9b41c9a18342c4c200a16b667a726f7b6812d0b))


### Refactoring

* move CustomError to separate file to prevent hot reloading issues ([9dd72da](https://github.com/subugoe/tido/commit/9dd72da7e03c714a9c724fd778d2b55cdd09fe57))

## [5.0.0-alpha.12](https://github.com/subugoe/tido/compare/v5.0.0-alpha.11...v5.0.0-alpha.12) (2025-11-13)


### Features

* add empty and error state within the sidebar instead of toast, always keep the sidebar toggle enabled ([62ea88b](https://github.com/subugoe/tido/commit/62ea88b3bc4f584303424ae5c7b5a6dbfdf4d42d))
* add multiple-annotations target selection  ([47483b5](https://github.com/subugoe/tido/commit/47483b5ce987f17d2bfa872d43dc810e8ff4bc89))
* add resizable panes for every panel content element, remove old sync panel feature ([2aa5a86](https://github.com/subugoe/tido/commit/2aa5a8607c196be4619a4d5a4ebf72e5d8aedb1c))
* add support for new content type header ([5619086](https://github.com/subugoe/tido/commit/5619086bcfd3f5b8a70dd7dd85207428fb91e4f4))


### Bug Fixes

* enable text scrolling in annotation list mode again ([fad0b21](https://github.com/subugoe/tido/commit/fad0b21764ca6df4f5f58efe6110e144dee91776))

## [5.0.0-alpha.11](https://github.com/subugoe/tido/compare/v5.0.0-alpha.10...v5.0.0-alpha.11) (2025-11-03)


### Features

* show annotation loading errors in toasts again ([c7aa2d8](https://github.com/subugoe/tido/commit/c7aa2d82fbeadf429484dea226d6540e825af9b5))


### Bug Fixes

* prevent double init of panel at navigation buttons ([4cd9e96](https://github.com/subugoe/tido/commit/4cd9e96f3d4d667507ad0eb7479ab6c8e915183c))

## [5.0.0-alpha.10](https://github.com/subugoe/tido/compare/v5.0.0-alpha.9...v5.0.0-alpha.10) (2025-10-30)


### Features

* add and fix loading state in image and text views ([bd91a38](https://github.com/subugoe/tido/commit/bd91a383f7f5a48f5e6ed2e4de7a8d3cc4df7eb7))
* add first implementation of bookmarking ([03ee825](https://github.com/subugoe/tido/commit/03ee825d05bb664ed763c2e05f59973424868b3f))
* add general panel error component, catch panel init errors ([#812](https://github.com/subugoe/tido/issues/812)) ([402ab99](https://github.com/subugoe/tido/commit/402ab9981b36196eccad12bc1057fe04ebde98d6))
* clicking Cross Ref link should either display the opening selection options or an error view ([ff0337c](https://github.com/subugoe/tido/commit/ff0337cc7a1b3a2b1d41325e44e699b66347c8f8))
* export encodeState and decodeState to the bundle ([f64c9d5](https://github.com/subugoe/tido/commit/f64c9d55e0a1e8cd31d6afd4e1a56649910f4782))
* remove annotation hints ([4ea340f](https://github.com/subugoe/tido/commit/4ea340f3c13e66a06938a1b8474f50394bba5326))
* subtract annotation sidebar from initial panel width, so it fits the container when opening iz ([fce3340](https://github.com/subugoe/tido/commit/fce33405d4a06873b9ff9d9eb873285d47a96f5f))


### Bug Fixes

* open correctly the selected mode when create a new panel ([02c4d95](https://github.com/subugoe/tido/commit/02c4d958e5428e0104e1bf983b3fd7744d4c5374))
* prevent text loading screen to overflow ([d3676a7](https://github.com/subugoe/tido/commit/d3676a7010c30e2ca0681a9eda41752f5f7afedf))
* reset error state on TextView on item change ([a89f160](https://github.com/subugoe/tido/commit/a89f160f753e8b9a84e58cddeaa8e0cfead3e5bd))
* set max width to manifest/item label popovers ([a0c4eca](https://github.com/subugoe/tido/commit/a0c4ecac319b37a4a61e951ede9b556a44aa4afc))
* show panel error on manifest/item label navigation when failing to find manifest/item ([31c6d05](https://github.com/subugoe/tido/commit/31c6d057455a144c48054983f9195450fc570c52))


### Docs

* update README, add embed example ([0320b80](https://github.com/subugoe/tido/commit/0320b80248dc63473cea68a9dcfc788513e4d0b7))


### Refactoring

* TextRenderer is now using JS native DOM manipulations instead of generic React components ([7568b1f](https://github.com/subugoe/tido/commit/7568b1fcb35f30d6d130aea7f60d724e2d901b20))
* use mouseenter and mouseleave instead of mouseover in text hover ([e1edce7](https://github.com/subugoe/tido/commit/e1edce71de58a64c23cba081dad2e27acea1a822))

## [5.0.0-alpha.9](https://github.com/subugoe/tido/compare/v5.0.0-alpha.8...v5.0.0-alpha.9) (2025-10-08)


### Features

* add an error node on api request failure in tree (collection or manifest) ([a284768](https://github.com/subugoe/tido/commit/a2847688674450b9fa8026dd2c40396a37ec93d7))
* deselect annotations on target/Annotation deselection and on outside click ([908b728](https://github.com/subugoe/tido/commit/908b728b49cb7e200c22a99f84cb0c90a430d6a6))


### Bug Fixes

* elevation hierarchy for backgrounds and hover effects ([0dfb713](https://github.com/subugoe/tido/commit/0dfb71356eb9c6158eda97134ee0072658946e7e))
* keep track collections by their id and not by slugs - fixes loading of nested collections ([fff0fde](https://github.com/subugoe/tido/commit/fff0fde2e97084a953f1efab6e4b8763c300937b))
* remove 'item' key from item label in Panel ([483690e](https://github.com/subugoe/tido/commit/483690e7a060c869cf0243c56e5ef9645a83a688))

## [5.0.0-alpha.8](https://github.com/subugoe/tido/compare/v5.0.0-alpha.7...v5.0.0-alpha.8) (2025-09-25)


### Features

* add List Mode of Annotations ([00e179a](https://github.com/subugoe/tido/commit/00e179aaa38c09784c586ec07aa1c2bd48097738))
* show tooltip at annotation sidebar toggle ([63f5c17](https://github.com/subugoe/tido/commit/63f5c176b78da6a4de844122098f650d41cb4249))


### Bug Fixes

* loading content from a more nested collection ([b332db4](https://github.com/subugoe/tido/commit/b332db40e3a860ca2234d6e8ad50cd7f21dfbf16))
* prevent app crashing when clicking on annotations sidebar toggle when no annotations could be loaded ([c9a7bcd](https://github.com/subugoe/tido/commit/c9a7bcd7f26996b658f6f76dd1e5f56d98e6ae88))
* show Panel Mode Selection Modal if necessary ([94746d5](https://github.com/subugoe/tido/commit/94746d5f6ef0fc09cb1d6e3878129b4c917c5076))
* update panel config in update panel ([c6d7820](https://github.com/subugoe/tido/commit/c6d7820ec7cdaa15816002148d7a7217628fa502))
* validate cross ref data ([8daeee5](https://github.com/subugoe/tido/commit/8daeee56824638ca9119ea1e524e68af93e1bd39))
* **witness:** check for witness value in witness chip ([464b9bf](https://github.com/subugoe/tido/commit/464b9bf4c9a92d1cd1c12d5b8faaded38a6ac9c0))

## [5.0.0-alpha.7](https://github.com/subugoe/tido/compare/v5.0.0-alpha.6...v5.0.0-alpha.7) (2025-09-15)


### Features

* add about modal in settings ([bd1de82](https://github.com/subugoe/tido/commit/bd1de827eea5bb2c8adb1fe321e05bb47dbb95ee))
* add cross references in TextView ([d796235](https://github.com/subugoe/tido/commit/d7962350fe07afd16b10960c6d6ad539079bf305))
* add namespaces to translations, use configured namespaces for different collection translations ([5616700](https://github.com/subugoe/tido/commit/56167002d59c68b37a70f8d81a478d60fc518426))
* add small delay when hovering an annotation before highlighting the text ([85436e7](https://github.com/subugoe/tido/commit/85436e765cdc4b8752287bcf3134afd42f26a134))
* add text sanitizing, show warning and error at text view ([beebd1c](https://github.com/subugoe/tido/commit/beebd1c26beeb2b3d9b9840a057e7e608b199037))
* add tree icons for collection, manifest and item nodes ([41608a9](https://github.com/subugoe/tido/commit/41608a955e06550c486d8bc5fe34fef3f3b48154))
* add type badges inside annotation items ([6ca1435](https://github.com/subugoe/tido/commit/6ca14358983179a062d5ca016f20fe64d0dee3a1))
* add variants display in annotation items, witness filter in sidebar header ([33bbdd9](https://github.com/subugoe/tido/commit/33bbdd9d6f8d5581e7a093e2a151fa0884e136b9))
* **cross ref:** always allow user to choose to navigate to target in the same panel or open a new panel ([cbda719](https://github.com/subugoe/tido/commit/cbda719382305de5b0b7aa7df6eba66316f7a1a4))
* move panel modes menu to the options dropdown in panel header ([8b899f7](https://github.com/subugoe/tido/commit/8b899f70090e4c1239ecdebf19f8ed5a8188fd13))
* resize panel titles based on panel width ([80f9848](https://github.com/subugoe/tido/commit/80f98487e3a6806ae3e4c0eae92ce0d2c1a24bd9))
* toggle annotations list and highlighting of text using annotations types filter ([e102b4a](https://github.com/subugoe/tido/commit/e102b4a5556f2e19c661d79855e26bfefe3643ca))


### Bug Fixes

* add key to list elements ([da65890](https://github.com/subugoe/tido/commit/da658907dffa60416674476d616aff2c282bc1cd))
* always load default translations (currently en and de) ([d33b054](https://github.com/subugoe/tido/commit/d33b05492f2882fbdca11e793f4d0f1aef9aa4ca))
* **Annotations:** add a slightly thicker outline for selected annotation ([96fe5e6](https://github.com/subugoe/tido/commit/96fe5e6efc3e393d635637564f8b9cb7da3223fa))
* **annotations:** handle empty target selector value ([01b9594](https://github.com/subugoe/tido/commit/01b95946185e763205b2ebb8c0f890efaced1984))
* **annotations:** hide nav buttons in annotation types by default ([026e0f4](https://github.com/subugoe/tido/commit/026e0f4a83e7570dfa6b4757ef7636518792559b))
* **dark mode:** show highlighted text clearly in dark mode ([d3e5dd2](https://github.com/subugoe/tido/commit/d3e5dd2267653dfcabfe8b95e38b95355e211c57))
* handle error of annotation collection content using Toaster ([379fcb7](https://github.com/subugoe/tido/commit/379fcb7a0022cb2d495db677471b1758e4542133))
* read and update annotations in PanelState after updating other panel states ([6ba1a00](https://github.com/subugoe/tido/commit/6ba1a00009fc957c0bb8eaa4f38fe66f0953af3b))
* remove immediate focus outline at dialog close buttons when showing ([874b8ff](https://github.com/subugoe/tido/commit/874b8ffc28c865aa161059fba034cae39de7940c))
* reset text warning on content update, don't overwrite initial panel config at navigation ([8f00dbc](https://github.com/subugoe/tido/commit/8f00dbccefa78c1ed3a87342e2885e8bad4067e1))
* show Metadata Value as parsed HTML Element ([e3ec83b](https://github.com/subugoe/tido/commit/e3ec83b3b19f9f94adedb79a2f1aa5f95155ea9c))
* show select panel mode dialog when creating a new panel from 'Add New Button' in header ([63819ab](https://github.com/subugoe/tido/commit/63819ab61cb0b574292679837abc6499e386b1e1))
* **Swap Mode:** restore swap mode feature ([3486a45](https://github.com/subugoe/tido/commit/3486a45a6c8a5ef4875d0dc37e17de3de204af3a))
* **Tree:** add an empty node when no items found ([a8fdc6e](https://github.com/subugoe/tido/commit/a8fdc6e425e5f4e6f667089bbc9a917bbbe8f7e7))
* use correctly deep merge for translations ([38939c6](https://github.com/subugoe/tido/commit/38939c6de9f121d8330cbcbc28b8cd2b0160d176))
* use Error Boundary for image renderer ([05abf33](https://github.com/subugoe/tido/commit/05abf33b7efcefe2dcd00de4a730143b89cc7fe0))


### Docs

* update contributors link in README ([0f656f5](https://github.com/subugoe/tido/commit/0f656f53f94849f33ab82db9117e11c5a11f0f9a))


### Refactoring

* improve the template of tree -  node children part of parent element ([b0c7c14](https://github.com/subugoe/tido/commit/b0c7c146fe505c296b354a97ccb25993090e642a))

## [5.0.0-alpha.6](https://github.com/subugoe/tido/compare/v5.0.0-alpha.4...v5.0.0-alpha.6) (2025-07-22)


### Features

* add annotation selection from text ([ae23947](https://github.com/subugoe/tido/commit/ae239472430c0b83b8913966e8a8244daf1b329c))
* add annotations hints bar ([e84b66b](https://github.com/subugoe/tido/commit/e84b66b026a5ea5f4da7b65aef96fb668c8b374d))
* add bidirectional hover highlighting for annotations and text targets ([17d7642](https://github.com/subugoe/tido/commit/17d7642a4a360f432fb433df2cc93a594873fa33))
* add first implementation of annotations sidebar ([2fc1647](https://github.com/subugoe/tido/commit/2fc1647d4c648cac474c97ebb6d93f55fa10a022))
* add smart display of views ([66188fd](https://github.com/subugoe/tido/commit/66188fd342196e8cacf329e797aef4ceed09b1f2))
* add TextOptions component to Panel and add toggling visiblity, fix annotation hints positions ([1b692a8](https://github.com/subugoe/tido/commit/1b692a815228ac33d28718defb10e5940c01f389))
* hide panel modes selections if only one mode to select, improve config validation ([c4f02a3](https://github.com/subugoe/tido/commit/c4f02a396b60f137ff829abf1a9ade4cfb0a807d))
* hide text options when there is only 1 content type ([61227f4](https://github.com/subugoe/tido/commit/61227f4548b10b0e9e06b8427ce36827f099b2e1))
* make clickable panel titles more recognizable, update neutral colors ([6793597](https://github.com/subugoe/tido/commit/67935976ce5fbebfdaafb31cd2a7f4416d0847bf))
* make view configurable ([1f329d6](https://github.com/subugoe/tido/commit/1f329d67f5cc0259faa1aebe9b06fc17c9bce748))
* move content types toggle visually inside the text view, use dropdown instead of tabs ([5f7e356](https://github.com/subugoe/tido/commit/5f7e356b37b76ea2dafa9cb20af0f181334fd3b7))
* open panel sidebar on target click in text ([9bb535f](https://github.com/subugoe/tido/commit/9bb535fac6a9258bf7ef92868d6f093e47a67994))
* remove headings in panel titles dropdowns, improve interactions ([f144132](https://github.com/subugoe/tido/commit/f144132461fad222b017f85dfc6fe7155d669ad7))
* set pixel values for panel widths, remove flexbox mechanism, control the display of components directly inside the panel when updating panel mode ([d3a4c3b](https://github.com/subugoe/tido/commit/d3a4c3b4371efcca1c76caca37f25cd24be227f4))
* use filtered annotations as part of panel context for central state ([ef656c3](https://github.com/subugoe/tido/commit/ef656c3c91f6b31f81e600a5bd2faf9b5a7852f4))


### Bug Fixes

* add chevron left in navigation button, fix some config validations ([fbaa157](https://github.com/subugoe/tido/commit/fbaa1571cac53f3b49bd7850981dc299813ab136))
* Improve Dialog component: add DialogPortal inside DialogContent (DC), DC takes a container and overlay prop ([819cff4](https://github.com/subugoe/tido/commit/819cff442a3f5608f0583eb88a5f8d25774d8fb2))
* set sidebar borders with own state variable ([260f1bf](https://github.com/subugoe/tido/commit/260f1bfe92a6cea864c8561070cb92189031dcd5))
* show select view dialog (svd) while opening a new panel from global tree, only when svd is enabled ([f03abdf](https://github.com/subugoe/tido/commit/f03abdf7db14031211bec69d08a18de3bd6c954c))


### Docs

* update README ([75ebc14](https://github.com/subugoe/tido/commit/75ebc14ecad0a9bbbf59ebbcd467a439d2168d98))


### Refactoring

* fix typing issues ([8b52177](https://github.com/subugoe/tido/commit/8b5217757a309fd33998807964c365ab5b33324d))
* minor config and design issue, add comments ([bfde5d0](https://github.com/subugoe/tido/commit/bfde5d08f598d64ecb1d1c43df0e6042a4818a44))
* rename "view" to "panel mode" and everything related to that ([1fe4d14](https://github.com/subugoe/tido/commit/1fe4d14c284157c4fd54bb62f0086ce6f39528c1))

## [5.0.0-alpha.5](https://github.com/subugoe/tido/compare/v5.0.0-alpha.4...v5.0.0-alpha.5) (2025-06-26)


### Features

* add smart display of views ([66188fd](https://github.com/subugoe/tido/commit/66188fd342196e8cacf329e797aef4ceed09b1f2))
* make view configurable ([1f329d6](https://github.com/subugoe/tido/commit/1f329d67f5cc0259faa1aebe9b06fc17c9bce748))


### Bug Fixes

* Improve Dialog component: add DialogPortal inside DialogContent (DC), DC takes a container and overlay prop ([819cff4](https://github.com/subugoe/tido/commit/819cff442a3f5608f0583eb88a5f8d25774d8fb2))
* show select view dialog (svd) while opening a new panel from global tree, only when svd is enabled ([f03abdf](https://github.com/subugoe/tido/commit/f03abdf7db14031211bec69d08a18de3bd6c954c))

## [5.0.0-alpha.4](https://github.com/subugoe/tido/compare/v5.0.0-alpha.3...v5.0.0-alpha.4) (2025-06-23)


### Features

* add loading spinner while image is loading ([00ae8ac](https://github.com/subugoe/tido/commit/00ae8accff09dbc62376d6638d3f60a7a8bc0c86))
* expand a single tree node initially ([77a23c4](https://github.com/subugoe/tido/commit/77a23c48ecf251e2c8be4e595e8703e42602bf43))
* implement local tree ([2a5416f](https://github.com/subugoe/tido/commit/2a5416f81f4568b69bd738152e5e2c3660637180))
* selecting an item makes Confirm button active ([f58ae3b](https://github.com/subugoe/tido/commit/f58ae3bfe5fafdc3d878e8b44c9911633713d554))


### Refactoring

* return node and not array from getExpandedNode ([ec1a496](https://github.com/subugoe/tido/commit/ec1a4962240334c6b33ee6776a337de214038e41))

## [5.0.0-alpha.3](https://github.com/subugoe/tido/compare/v5.0.0-alpha.2...v5.0.0-alpha.3) (2025-06-16)


### Bug Fixes

* rename css layers with .tido ([560aa53](https://github.com/subugoe/tido/commit/560aa5373d72fed10903ca14c9b03cfd6b0e367c))
* show the select view modal from 'add new collection' header button only when it is enabled ([b0c70a2](https://github.com/subugoe/tido/commit/b0c70a2f79b50775579baf1fd3a5491e042bb5cd))

## [5.0.0-alpha.2](https://github.com/subugoe/tido/compare/v5.0.0-alpha.1...v5.0.0-alpha.2) (2025-06-10)


### Features

* add easier navigation inside a panel through manifest and item modals ([#666](https://github.com/subugoe/tido/issues/666)) ([ef32111](https://github.com/subugoe/tido/commit/ef321111d465532145efe48bdcbb818f7b3ae081))
* add icon as preview in pip mode ([5821056](https://github.com/subugoe/tido/commit/5821056e6a9e28523cf69ddd015b2bbce9eebb9b))
* add text view selection when creating a new panel ([885d344](https://github.com/subugoe/tido/commit/885d3441a9702ad319b20226990e99bb5f07591e))
* add tooltips to buttons in panel header ([f02b691](https://github.com/subugoe/tido/commit/f02b691e32d3a4629dfbb2cef70086929b35868f))
* make panel placeholder configurable ([4a23820](https://github.com/subugoe/tido/commit/4a23820f6e09530aeecd351cdd0d1936123a8350))
* render panels from panel store instead of config store, avoid mutating panels config for updates and use panel store instead ([68d8357](https://github.com/subugoe/tido/commit/68d83578298d65811730a961f4e8502a3697adb0))
* update default panel width ([3338c03](https://github.com/subugoe/tido/commit/3338c038c488b0f19eec150abb94bdafae08f424))
* upgrade to React 19, add dark mode, refactor shadcn components to use CSS variables ([68d482e](https://github.com/subugoe/tido/commit/68d482e3e009d575371b599ccc78cb023802fa4b))
* upgrade to TailwindCSS 4 ([8f808cc](https://github.com/subugoe/tido/commit/8f808cca2d1ea3ccb170006c00eac4eddedc484f))


### Bug Fixes

* read view index from panelState while rendering Panel ([90fb4f7](https://github.com/subugoe/tido/commit/90fb4f77b220d9b9aaac10d69d19c306d747f32a))
* show the root nodes of tree with a valid api response ([2fd3c71](https://github.com/subugoe/tido/commit/2fd3c71bbd0d17834152bddc05610c9a618007c1))


### Refactoring

* remove prefixes for TailwindCSS classes ([0f67173](https://github.com/subugoe/tido/commit/0f67173bf3342d180725c06ac09babe196dde5e3))

## [5.0.0-alpha.1](https://github.com/subugoe/tido/compare/v5.0.0-alpha.0...v5.0.0-alpha.1) (2025-05-05)

## 5.0.0-alpha.0 (2025-05-05)


### ⚠ BREAKING CHANGES

* move to React

### Features

* add "theme" object to config with primaryColor as first theming option ([8c86f8a](https://github.com/subugoe/tido/commit/8c86f8a74c7b96116db997231bf3877f2c3db000))
* add allowNewCollections config option ([3aef570](https://github.com/subugoe/tido/commit/3aef57090f266c3f0b85e72eb7c646dcb5df9518))
* add chevron icons at tree ([883e522](https://github.com/subugoe/tido/commit/883e5223755242355a4d042edc0dda09c4987119))
* add collection title to panels, fix text view toggles ([1e93483](https://github.com/subugoe/tido/commit/1e93483d75bb5d3dd222460f3290ff8a63e450fa))
* add collections in collections ([#620](https://github.com/subugoe/tido/issues/620)) ([783c889](https://github.com/subugoe/tido/commit/783c889235f71c4edc08b980842997736179067b))
* add DataStore to keep collections, refactor panel rendering ([c5ec25b](https://github.com/subugoe/tido/commit/c5ec25b23e5fb6000140d6b8878c3e4c24778d05))
* add defaultView config option to set it for all panels globally ([c00fdbf](https://github.com/subugoe/tido/commit/c00fdbf4d49c614079da6ce166c845aa46748f4e))
* add navigation buttons in panel, refactor panel rendering ([bd11bf5](https://github.com/subugoe/tido/commit/bd11bf5cbddd26e63636cdfc9cf1e28eeb49f931))
* add pip mode in Panel ([#585](https://github.com/subugoe/tido/issues/585)) ([2469126](https://github.com/subugoe/tido/commit/2469126b9c42172551d0176b2f2d9b0fbd7fd333))
* add placeholder in ImageRenderer, update PanelBody design ([e9b3ed3](https://github.com/subugoe/tido/commit/e9b3ed3b3409503c311858345ad66f8a5076e041))
* add showNewCollectionButton config option ([0043913](https://github.com/subugoe/tido/commit/00439130e9b92be62952427dd4a07841e3c439f2))
* add support styling ([fb36908](https://github.com/subugoe/tido/commit/fb369081bd4391555595ad364ee18cb923199bb3))
* add switching among different views, use OpenSeaDragon with image action buttons, use Zustand for the PanelState and open a Popover on click([#543](https://github.com/subugoe/tido/issues/543)) ([1a0eb03](https://github.com/subugoe/tido/commit/1a0eb0363b613250ce0dd65c30f705cb83549474))
* add sync panel scrolling feature - example TextAPI data, target… ([#567](https://github.com/subugoe/tido/issues/567)) ([ec301ce](https://github.com/subugoe/tido/commit/ec301ce683ff90f64478b2fe0f9c3cd154192b2f))
* add translations in build time, we consider two default (en, de) translations files and the translations provided in TIDO config ([#611](https://github.com/subugoe/tido/issues/611)) ([2dea4ac](https://github.com/subugoe/tido/commit/2dea4ac97cccadaaf625f0f60d5712ff94719abb))
* add update/create a new panel through the Global Tree Modal and make the Tree Component generic ([68463b8](https://github.com/subugoe/tido/commit/68463b8f899c5cc25d9b3fca8420ae6ee54c90c8))
* add variable panel width setting, panels grow on first load, check if panels fit when adding new one ([836d998](https://github.com/subugoe/tido/commit/836d99864e36ed711f41b9a6dc45ab3654ad4a66))
* create panels dynamically by selecting from a generic tree component ([1fcd1f4](https://github.com/subugoe/tido/commit/1fcd1f484e142e2ac7c711b08ff2b760e613f210))
* display titles in panels ([013dc0a](https://github.com/subugoe/tido/commit/013dc0a15e43a57c41f814e7d137fc3617c60aca))
* implement remove panel from actions popover ([014d819](https://github.com/subugoe/tido/commit/014d819f98487cb9d2ed0d14606c005ea8d8308d))
* make panels resizable ([f6700b5](https://github.com/subugoe/tido/commit/f6700b5190322fc5f074e1a871bb19f513c78c0c))
* move to React ([6a90e42](https://github.com/subugoe/tido/commit/6a90e424374da31c8dc1878dc5ffda75299142c3))
* put empty panel element next to last panel with tree selection dialog to add a new panel ([aa00bb5](https://github.com/subugoe/tido/commit/aa00bb5d8d6c6a41887fb73e9cb58489c4156381))
* redesign "add new panel" feature, add dialogs for each option ([bf0fa3e](https://github.com/subugoe/tido/commit/bf0fa3ed2fd45703e8422f9f12c5452a011b3c5f))
* remove sync panels button ([65fa4f3](https://github.com/subugoe/tido/commit/65fa4f3e69fba73c34fef2c1d048fa6d67615cea))
* rename Tido prop from "customConfig" to "config" ([f8dc804](https://github.com/subugoe/tido/commit/f8dc8047c8472d7f6776f508a03fb7510b699921))
* show panels wrapper which contains text and switch between different types of text content ([#533](https://github.com/subugoe/tido/issues/533)) ([f00feee](https://github.com/subugoe/tido/commit/f00feeea0b50c92286474607de10533406518e86))
* update panel content loading, detect more MIME types ([c595ccd](https://github.com/subugoe/tido/commit/c595ccd540fa944ef0b1df2e8254f19cf3a7d56c))
* use default config to merge with custom config ([35e8e84](https://github.com/subugoe/tido/commit/35e8e84c2cd8abea3b96170baf799fbc5bddf8f4))
* use Lucide icons ([f8ea0d3](https://github.com/subugoe/tido/commit/f8ea0d3ca1063a0d51f982a4d7f72e917de43adb))


### Bug Fixes

* close the modal in global tree on click outside ([a747554](https://github.com/subugoe/tido/commit/a747554f56e7833cfe245b44228d5fc8c804e16e))
* closing remove panel popover ([a0145cd](https://github.com/subugoe/tido/commit/a0145cd8b993a3746221702f5c76f8f60d3ab3b9))
* image renderer resizing, image error states ([01ce9f8](https://github.com/subugoe/tido/commit/01ce9f86fcf345b1050926eb9e68674298b69480))
* improve the design of metadata heading on hover ([7511b7c](https://github.com/subugoe/tido/commit/7511b7ceee49cd1de69edb281302e7645467ecb8))
* panel wrapper overflow at opened global tree ([d170578](https://github.com/subugoe/tido/commit/d17057813a903a0d60cd4dee2dcbbcd25f25ce7e))
* replace id with html element in OpenSeaDragon instantiation ([2ecfff3](https://github.com/subugoe/tido/commit/2ecfff3da5f558013232a09e1cd9d7d0ee91d086))
* reset the selectedNodeId to empty when new panel is created ([18ee3eb](https://github.com/subugoe/tido/commit/18ee3ebbecbd85a3d527fd54a9f20c5cefb1cef1))
* set a max height for local tree modal and add a scroll bar when this height is reached ([7aaf764](https://github.com/subugoe/tido/commit/7aaf764eda56590df5a18a59807079377fc264b5))
* set bg color of tree item to primary onclick ([4cdd5d5](https://github.com/subugoe/tido/commit/4cdd5d5cd1fabacc48a67cfcd91f8182eb57c385))
* transition global tree when hiding/showing it ([31e8c35](https://github.com/subugoe/tido/commit/31e8c35431fc5fba2560bd2aed203f2166cd5a04))
* update global tree transition ([b2745c5](https://github.com/subugoe/tido/commit/b2745c5d44d49b978cc00c9e2af870ce5696772c))
* use .tido instead of container selector for theming styles ([c93fa87](https://github.com/subugoe/tido/commit/c93fa87d7492892ed3893f3bf9262160dc93b01a))
* use "collection" instead of "entrypoint" in config, fix several panel rendering issues ([2829c07](https://github.com/subugoe/tido/commit/2829c074720f5449bc779a7ef9de6be3e045cc7e))
* use collection instead of entrypoint and push the text of the tree item more to the right ([#599](https://github.com/subugoe/tido/issues/599)) ([43b087a](https://github.com/subugoe/tido/commit/43b087ac1e0b36b9a8aed640f1c830dfb6e716b2))


### Refactoring

* build Tido as React component lib bundle, as well as standalone bundle ([b2f3b0c](https://github.com/subugoe/tido/commit/b2f3b0c4208a10ec3f566952f207f5b354676944))
* move theme styles to App component, rename Config interface to AppConfig, resolve typing issue with customConfig ([6484d3d](https://github.com/subugoe/tido/commit/6484d3de396d1681a4cab08b02f0d2cb1c4f85f7))
* rename stores ([6da919d](https://github.com/subugoe/tido/commit/6da919dc0ec33bd75c49a0e1deb50008c7b72aac))
* rename to showAddNewPanelButton ([e3312bf](https://github.com/subugoe/tido/commit/e3312bf49a84ef8eeebcb343cc4c3673ddf44489))
* use a map object instead of array for collections in store ([39165cb](https://github.com/subugoe/tido/commit/39165cbaf87a08c922d92d0d284a5e6ed70f843d))
* use config store instead of context ([69f2975](https://github.com/subugoe/tido/commit/69f2975bb70c311a5ecf279e0c889360981adbad))
* use updatePanelState in text  views toggle ([0cf89cd](https://github.com/subugoe/tido/commit/0cf89cd86a76e5588e2d7370a54e4b521bd61a09))

## For older versions of TIDO, please continue with the old [CHANGELOG](https://github.com/subugoe/tido/blob/main/CHANGELOG.md).
