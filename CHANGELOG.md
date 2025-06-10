# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
