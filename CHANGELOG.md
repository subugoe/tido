# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.12.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.11.0...v1.12.0) (2021-06-17)


### Features

* add padding to list not to overlap with FAB ([0db4c91](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0db4c9184adb9f952da39bc78707539db4793074))
* fab with highlight all/none ([463333d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/463333dd75e57b784d40cf24fbd08bea38fa1e53))
* fab with highlight all/none ([3ad837f](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3ad837fd856e50a9ae4939590a74c95a19230291)), closes [#158](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/158)
* implement motifs tab in annotations ([f64e38a](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/f64e38a986af103ff27afa7c4ce7d4c9f475cd45))
* styled fab ([1aaeb65](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/1aaeb6575f9a3200a5d5fb737e3716feacd0bf73))


### Bug Fixes

* closes [#275](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/275) by resetting the toggle state on text panel update ([6c6d888](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/6c6d888af5e6d12e0ed2ff57ec32e67c76e62e0a))
* highlight all or none in respective tab ([2dae09e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/2dae09ee1b70434eb327b51140b5cb6f17c3c346))
* last element not cut off anymore and list is scrollable ([766d4a4](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/766d4a4a26dbf88ca3faccd3470dd2832ac97a1f))
* provide scroll area to scroll the list of annotaions wheever it excedd it's viewport ([fba060c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/fba060cc0e11cb3e8aee0fa528ff293b5a690396))


### Styling

* accent color for floating action button annotations panel ([183ca40](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/183ca40ba77912191f9d132ab59d5f7ed164e994)), closes [#282](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/282)
* adopt the styling from the text panel (content.vue) ([e16bed7](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e16bed7a91984af7b77ea02de315208bad214f81))
* basic "style" (fix typo) ([afaa1fc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/afaa1fca2b8f4150aef22a7a28923fa38b636dbc))
* changed color style to use quasar variable ([24b230d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/24b230de819a9c2a2629fa5e3096e36a12f0a022))
* improve icon spacing of annotations in text panel ([d4ffdb8](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/d4ffdb8b44c1b9a5f8bd4384a250416fae64c66b))
* improve var name ([7bea027](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7bea0276573e7ccfaf923b03d1d48e4541536a75))
* introduce new folder for several annotation components ([8cf0e2f](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/8cf0e2f4c55f4f6b044eadd75df030e19dd7e6b8))


### Refactoring

* addressing review comments ([55d865b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/55d865b67a13f96db312390ae5427db3b2297159))
* annotation tabs have to be generic ([dcaad91](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/dcaad915595117cfe0eee48adf7f56d25bc6462a))
* highlight all or none code refactor ([469e825](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/469e82563d6c5429da8916269e6d17cc35d70aa8))
* improve maintainability due to modularization ([594a26e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/594a26e8b48b2490c598fa33ffd5607f9af9c747))
* improvement: split the template into it's main parts (annotationlist) ([a44038d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a44038d4fb47b952dddd3eb161a536ea404b74a1))
* logic to add text class names ([5f9e3d8](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/5f9e3d8ab78fe2f4748234b3299afff420ea807c))
* provide a template for the upcoming annotation toggles to be treated in [#271](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/271) ([39a10d1](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/39a10d146d498f675730f4f92c50a617659675b9))
* provide new component "annotationlist" ([9190f9e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9190f9e42b1e01241482525e9799b6845a1471b3))
* remove obsolete code ([28b9412](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/28b9412034b9cc94083616623cf309ef0a3ff315))
* renamed prop and added i18n to tab titles ([968ea86](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/968ea86834531ad46cb63d1829e4289f17d4a2ae))
* show notification if annotations aren't available ([fcff762](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/fcff76247efd9c4d378366bb9460455138657b6a))
* wrap text elements to if condition ([1d62df8](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/1d62df898f8a776cc8088bded87868965a2b55f2))


### Docs

* add docs about stages [skip ci] ([e775784](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e775784402e02e4468720cabefcd3a4d8cbe82e4))
* extend docs for ci scripts ([65c3b9d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/65c3b9de4a34469665d0eb7835395f8bc44fa83c))
* update README according to the changes in the congig object ([289ad26](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/289ad26a8848685face17b1586599916fb425a57))
* update README in regards to annotation type configuration ([3e7d78e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3e7d78ef90c59137bb5ce6312f1770e4d27799de))
* updated read me ([86ad976](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/86ad976cc2342f2cffbfbb0d5b025589a8032bb8))
* used suggested translation ([e42d087](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e42d087e329785922297aece832fb644c8dce85d))


### Continuos Integration

* remove entry point ([2a7b302](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/2a7b302e6708978eea73f88c9db33fe44eeab534))
* remove entry point ([27d5fc4](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/27d5fc472ac11873b9d6558d19e52b04ce99b214))
* remove entry point ([aabf429](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/aabf4294af609dd14fb7f79871814f2ae4dd8c3e))
* remove entry point ([bfff14a](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/bfff14a3ccafa41adc5d175c34e6d148db40136a))
* remove entry point ([579b690](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/579b690e6db85c6953122892023663c0184b07e2))
* remove entry point ([f722a02](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/f722a025e8c8ca5523996b380f631c9270cf4428))
* remove entry point ([32d1ac8](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/32d1ac826565fbcba43f04dacbcaa099eb2d2937))
* remove entry point ([f6ec55e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/f6ec55e725e189e40bc09ed486b2eddeb3f1e367))
* remove entry point ([cdf6950](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/cdf6950b650bf745486e1fdec2c0f993f79a1e98))


### Chore

* add entrypoint for dev ([888025b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/888025bc2e5d94fbe0edc23a53008f1bef45d0fb))
* merge branch 'develop' into feature/[#272](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/272)-annotation-motifs ([3596ab8](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3596ab87b5433f51971611f381f7cb9aab9864a4))
* merge develop ([ecceda5](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ecceda51e109913a14cfc348ff740239ea894194))
* relabel toggle buttons ([0a1df8c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0a1df8c18fa660e213dd5d992510d5d022fe151b))
* remove obsolete style block ([b1a9996](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b1a9996201bfa622ca00ef5927d677ee75b5071e))
* typo ([3ef43aa](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3ef43aa0f0ad288179fafd7da3830e59567aa430))
* wIP: try to tackle last list item which is still cut off ([89e018c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/89e018cbf0b7dc4dc17f166d2e4abfb09afbc99a))

## [1.11.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.10.0...v1.11.0) (2021-06-01)


### Features

* annotation panel shows annotation about current text type ([e6a3602](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e6a36028375dd961d61e54f8ea89418033973458))
* default not highlight anything ([29155db](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/29155dbcab0e98ba4878995a31bbe170ffcba544))
* implement links functionality in annotations panel ([385244d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/385244dbee2d58b7ed62d52a7117aa73e23a8004))
* to display a notification message if there are no annotations ([9482003](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9482003e0e1b65ae4bf75bf6c5fd55132dde27f4))


### Bug Fixes

* refactored the logic of updating the annotations according to text types ([0b35918](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0b35918baccbcd933b49df9591645d7fee31d416))


### Styling

* adjust icon size of annotations in text panel ([fe55b46](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/fe55b46c44c4c818afc3b6dfaa0dab2827e30671))
* adjust padding in tree view ([9ce0393](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9ce0393cd6d3c0945b24c4faaf1efca1e1bca913)), closes [#255](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/255)
* clean up panel toggles style ([df3fec1](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/df3fec110586857f3eaf2e98ad668a3d515fe83f)), closes [#258](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/258)
* mark annotations in text panel ([b2bc222](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b2bc222e8034419ea4ac77da33a67908073029c0))
* save space in annotations list ([72a1b7d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/72a1b7dc616c8cdc3b81ccdfbc6a940f379f1e45)), closes [#261](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/261)


### Docs

* adding explanation about linting exception ([045f616](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/045f61645ae38c6e0ec773757ac77cc6ae7352df))
* updated text according to review comments ([f102078](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/f10207842d159f211e4a38cc3181590685f75011))


### Refactoring

* changed notification title ([e684c2d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e684c2d50e1e6bbac9ee704dc2ee1fb8986040c0))
* move misc icons when header string is deactivated ([a56ec22](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a56ec22ea868a05b121d1c14c3214fcc5b15a70f)), closes [#264](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/264)
* refactor smallcaps css ([3e7959f](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3e7959f18b48f5c3dccfce6670d97dc24fad660b)), closes [#259](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/259)
* refactor TogglePanels ([45fbe13](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/45fbe13f3b4930b78dcd5c8bb00662ae79a484cd))
* updated style and added language change ([b85828a](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b85828a0019bbd7c67b4ab3b0e52ace493f6f9a2))
* updated text style according to review comments ([7e6a20d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7e6a20d471c3252dee4324aaa75a2c6fdd84048c))
* used camel cases ([cb73038](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/cb730382d745173c207252d95e8aab440c42c362))


### Chore

* merge 'develop' into feature/[#237](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/237)-annotation-links ([61d3cd4](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/61d3cd4b048af2d24fa23cac3a18f1f5811ff71a))
* merge branch 'develop' into feature/[#257](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/257)-notifications ([dd589fc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/dd589fcc512893c3369a74e54c8d8a75bd667803))


### Continuos Integration

* remove entry point ([0142122](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/014212243efcb80437c8322349054b704cb63abe))
* remove entry point ([3c63129](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3c631299509c1d8c30b66667588ab43ff2da03bd))
* remove entry point ([4cdaefc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4cdaefce6ffc2a5ed00d04711ceaa32f326366c3))
* remove entry point ([0621347](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0621347e73b9f44f632c57f8af12a3eb4421b8ab))
* remove entry point ([5e9afc2](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/5e9afc2699919171f3cd048076f1ba6761b996bc))

## [1.10.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.9.0...v1.10.0) (2021-05-12)


### Features

* implement multilanguage-German, add tranlsation, config ([83e62c8](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/83e62c869dff6681517794060a1cad02097efc84))


### Refactoring

* add tranlation for sheet and addressing review comments ([007d7e0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/007d7e0b5b127ca867724ecf2bcd7c59a0b97a09))
* add tranlation for title ([c8209a1](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/c8209a1c9d8dea98969495efffe628bc1be22e83))
* changed de to genaral way and added statement to readme ([c3cabff](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/c3cabff60962e8acce7f02fba8e0daefcbea30f9))
* fix translation to icons in image panel and added parameter to make default lang ([7b4bdb8](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7b4bdb8bf6625742c5cd01da424cb84b93226f3c))
* renamed copyright ([ccf2190](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ccf2190f8f352833861869286ce44251d506edc9))


### Styling

* consistent border radius for hover items and alike ([40db4bc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/40db4bceec6f3014925467981b5ebe343a7d2e0f))
* make tabs in various panel look the same ([9cfa574](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9cfa574431da94a4c694a6aaab3d444d53867d99))
* panel title style polishing ([99ce6d6](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/99ce6d6ebcab41b91d5b5bb8420489658675b453))
* style links in metadata and similar places ([3613876](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3613876a3226f88b4ee94833a9eb934110d5efb8))
* style links in metadata more like Quasar likes to do it ([80f9295](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/80f92959d9f2fdeece04d8101e03019f8e5f4343))


### Continuos Integration

* add entry point for testing ([b872a41](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b872a417fe9ad22ac25672b726ed60fd7af2a3e6))
* add tracing ([252d8fd](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/252d8fdfaec45cf89431372ac4dbe8ea8dfed36d))
* only add new directory to artifact if build isn't canceled ([5dab803](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/5dab8036b530c596304a624ea0b9e2e9c825f25d))
* remove entry point ([0e1fd14](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0e1fd1404dd73d71aadb2fa0f23c48607d4ae8b0))
* remove entry point ([09389b3](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/09389b3f974f802113c4c6998e28e1db94b7572a))

## [1.9.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.8.0...v1.9.0) (2021-05-03)


### Features

* add annotation highlight to text panel ([a17bd7c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a17bd7cb41701a5e517c8cd8272ca75306a62ece))
* add basic configuration for annotation panel ([8a6239c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/8a6239c52b55f965a454207f1622708b41a2d791))
* add empty annotation panel ([9996d92](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9996d9267bf1c84f756ff8d43c54d44606e300bb))
* add icons to annotation list ([483b771](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/483b77178e467abd7d8a80fe7f5a3d13170c61b0))
* allow 2 and 4 px values in CSS ([8cbdba1](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/8cbdba19b8567149d7b6a0031ab53222d1c01571))
* completely added annotations panel ([91864dc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/91864dc7d1e7d4c0ad5e48fff770a4fdccb9ff85))
* configure to show either of the panel toggles ([ccec6d2](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ccec6d28f9871aea15c19d5294837a2b1fa7b196))
* create reusable urls component and implementing links in Metadata panel ([0d809e9](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0d809e9968ba6c8edb5905c5e13dc088641fbc21))
* getter for multiple html content serializations ([8ba887d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/8ba887d86a493cc41ea5c1fb8c167b2b230bd6a4))
* harmonize object keys ([4bd9dc1](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4bd9dc1ccb5c12cb1f2a6f8242f2bc695f9895b5))
* move annotation data handling to component ([29fa9b5](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/29fa9b5a1346eee7434bdab6e7123289a02726a8))
* prepare getter for annotations ([9db4bde](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9db4bde8079c0049c1f8dc680524786f47e74169))
* remove getter for annotation body text ([7325b1a](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7325b1a2427e198a4f3a528582a2dc8a5fe1f8ed))


### Bug Fixes

* adjust panels and display content according to screen size ([6e77418](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/6e77418f9cc56c4d6309d25b9f16e8ad5620e9d0))
* css syntax ([00aea79](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/00aea79b4c64d5d10e6a8c22b62d2e40e63d4af9))
* make annotation list full-width ([08da9fe](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/08da9fe252d3845107ea1383a5d2122723008dde))
* no-console ([c2157b6](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/c2157b65e993b53b157f573aefe00e021ef20200))
* overflow added in mainview ([a1e64d6](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a1e64d6beb3d95c8e6e2f1d48d04dcfb727d4e7e))
* overflow/scroll bar issue ([3bc1475](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3bc1475612f9bcf6fa9da9f5a547e1d6314f4aab))
* set scroll bar at treeview ([bcb0ee9](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/bcb0ee93b1439f2192d5d2b0817b616e8ef7b170))
* syntax ([ffaea9e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ffaea9e2d4db4d72478c5f061b7b180af312f610))
* typo ([5489f23](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/5489f236d957637c8509171d148bedf9965c3c48))


### Reverts

* re-introduce drop-down for panel toggle ([861467a](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/861467a0407fb0eb20e9d5c5cd62ab3ca21dd687))
* Revert "refactor: moved drop-down logic to same component" ([072762b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/072762b4b3611c1dcecbf9bab7f2c833e2744461))


### Tests

* add entry point for testing purposes ([7deaa3e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7deaa3ef80ce7d62f3a597f5ba3ecdc35195fcf6))


### Styling

* add no-padding ([8dcb61a](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/8dcb61a244f82691d6aa45195744cf581a8d443a))
* added a style class in metadata panel ([a55825b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a55825b19d279c378813617da33fd0a96b190f0e))
* adjust icon colors in header ([323d5f9](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/323d5f9906264d60fd6ff4189e0efea9bd3f6484))
* don't use CSS style ([6035fb7](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/6035fb73c7e162a0bf43b4e0ddc44c55be833028))
* reposition icons in header ([a195f90](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a195f90a9d269e8f3822262741c860238625ed0f))
* save space in metadata panel ([45581fd](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/45581fda3b04ec9562399abfb916dd414626abb8))
* save space in tree panel ([0cc9115](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/0cc91155fdfcf7c033585d20522efe6813ba0c89))


### Improvements

* hide the reset button when TIDO is configured to not show any toggle at all ([2ae93e9](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/2ae93e9389400db7c847adedd09e003d98a4fe8f))
* switch to quasar color class names ([d7d5963](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/d7d596369eafdcb168bdb412756a2c21febb36a5))


### Docs

* adjust README.md ([c9c6332](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/c9c6332cee2ca731816f47f0c32f84e9d303dc27))


### Chore

* adhere to consistent camelCase ([49e3921](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/49e3921bb69ec10a5178c8c31e4536198d645a68))
* condition statement ([df1a41d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/df1a41d3abddbd30145f8bcd66b35562c0c733c4))
* improve readability, order methods by alpha, refactor some parts to be more JS-ish ([e2c0bac](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/e2c0bac709bb15615c3c8a6c30199a77bdbd2c6b))
* merge branch 'develop' into feature/[#194](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/issues/194)-links-implement ([a2639eb](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a2639eb3508b957dd5c172ad6c2b85baa4d14ea2))
* merge dev state into feature ([6ec8900](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/6ec8900b78494549cc67c9e3093c339aba9954cc))
* move [@style](https://gitlab.gwdg.de/style) to css class ([cd4b0a0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/cd4b0a043b188081464b80cf994b8b5214402e13))
* remove entrypoint ([7dfaddc](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7dfaddc5c62c030eb8179b5d4365aedfd9c21e03))
* remove TODO after discussion ([134bf23](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/134bf23684b4b75530dd884d545926cd32ca403c))


### Refactoring

* adjusted color back and removed entrypoint fromindex template ([a24b74f](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a24b74fd8fffc1b7ae00bab369e2a1e7f0ee1b25))
* adjusted header toolbar and styles ([4ac6be6](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4ac6be6d00418a29976f67d4ec41c701fd303842))
* change print command ([f2ba241](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/f2ba2410a331da9c01a175327b9d52cb381c723c))
* consider linting ([1195cac](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/1195cacb58ae8cbd5420005531f7a7484638ee75))
* consider linting ([ee6f3ab](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ee6f3ab02cb5da2ca6fc722f54eb3a8fa6e98acc))
* refactor language and added a space to links ([b59b04e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/b59b04e1303df6c2ad0b3dfab0db9e393324c546))
* remove dead stage ([95ec4a9](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/95ec4a9a838c4e8f52d624062e3d6757031c4f7d))
* remove space character inside span ([4f36341](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4f363419470f1bc2a59c85f12a4ca0af04f7baf7))
* save space wherever possible ([4fdd5ea](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4fdd5ea09fa3c6724c16f1aae87ec1ed95dbbcd4))
* updated styles to make scrolls work back ([36ae6e2](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/36ae6e24c91a9c77695f7618e4d8d6d7b37055ae))
* work-around to display useful text for links ([87ff816](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/87ff8166e32bcad9dc8fc0fef516ff2ae254f9db))


### Continuos Integration

* add draft for cleanup ([ed2bc1c](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/ed2bc1c1c44d59bf8b836e5d15185791ce0c01e7))
* add script for 404 page ([a1f139b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/a1f139b65c469493073f262de34159552ae0a04b))
* add set up for removing entry points ([9d49446](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/9d49446bc316323e47eec0dd24fe3d7cc6aa1036))
* add template ([3aded7e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/3aded7edc7cfb14e7ab01290ec2befe6ebc5a55d))
* add variables ([40b251b](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/40b251be8e6888f8e29e35d0eb9d43696d23599e))
* execute 404 page script on demand ([8923335](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/89233354cde0b98fe64ee7425474b917c297e7b7))
* move scripts to separate dir ([acef885](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/acef8854fc0cf9f7235bfada7bbae3e29888660b))
* move template to script ([45ad009](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/45ad0096301e258e08368030d99883ff7077dd53))
* remove entry point ([61b2923](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/61b29236169b47248b828bc7beb73a451ad6d493))
* remove entry point ([7d06f99](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/7d06f99a5ea85eed6fa1c8f3749f8b61d51bbba9))
* remove entry point ([600d094](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/600d0941531c35d82993a0f02bd0e836fc748a2a))
* remove entry point ([da24152](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/da241526964f6fabbd9dcd0142024d01fd3dcebb))
* remove unused data ([8f23173](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/8f2317344fa3d7d7a439614401b394e9f518e561))
* restrict clean_up to develop [skip ci] ([1916959](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/1916959b2b133c38ecf45663a4e79702d68b0f2a))
* set expiration date for development artifacts ([4f991ad](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/4f991ad31e1ae6467c028fdea209abfec0e4eaf2))
* switch to image that has dependencies installed ([5c41768](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/5c41768939f674f32d6ba9acc0354b38477ebb81))
* test replacement ([1def71d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/1def71dca9aa0756dbabcac39dbd231c68ffe46c))
* update Git user mail ([943fec7](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/943fec794705fae0b8442ea694729e00f6433e34))

## [1.8.0](https://gitlab.gwdg.de/subugoe/emo/Qviewer/compare/v1.7.0...v1.8.0) (2021-04-01)


### Features

* enable TIDO to display more (+n) text types as tabs ([21df73e](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/21df73e17da5210580a6bdea7baa8d5dbebc788f))


### Styling

* consistify styling ([dd3e07d](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/dd3e07d9af968072724e98c8d51d4e24af185100))
* un-hide scroll bar in text panel ([dbcc7fb](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/dbcc7fb4523a0ae2aa04920a2a13cd55f9cd5f23))
* un-hide scroll bar in tree panel ([119ee00](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/119ee002d5f765c1ad514856b275a821d13eb445))


### Refactoring

* addressing review comments ([02fae63](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/02fae63bfc6ba2cdcbb8de2d43b5784dc7e2c153))
* display/show the text type and not make it clickable ([91ff031](https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/commit/91ff0315d316e705d0722f78f7567902c586b688))

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
