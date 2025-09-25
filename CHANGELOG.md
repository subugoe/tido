# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
