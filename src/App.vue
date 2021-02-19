<template>
  <div id="q-app">
    <q-layout view="hHh lpr fFf">
      <Header
        v-if="config.headers.all"
        :collectiontitle="collectiontitle"
        :config="config"
        :imageurl="imageurl"
        :itemlabel="itemlabel"
        :itemurls="itemurls"
        :manifests="manifests"
        :panels="panels"
      />

      <q-page-container>
        <router-view
          :annotations="annotations"
          :collection="collection"
          :config="config"
          :contenturl="contenturl"
          :fontsize="fontsize"
          :imageurl="imageurl"
          :itemlabel="itemlabel"
          :labels="config.labels"
          :language="itemlanguage"
          :manifests="manifests"
          :panels="panels"
          :request="request"
          :tree="tree"
        />
      </q-page-container>

      <Footer
        :projectcolors="config.colors"
        :standalone="config.standalone"
      />
    </q-layout>
  </div>
</template>

<script>
import { colors } from 'quasar';
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue';
import Panels from '@/mixins/panels';

export default {
  name: 'Viewer',
  components: {
    Header,
    Footer,
  },
  mixins: [Panels],
  data() {
    return {
      annotations: {},
      collection: {},
      collectiontitle: '',
      contenturl: '',
      config: {},
      fontsize: 14,
      imageurl: '',
      isCollection: false,
      itemlabel: '',
      itemlanguage: '',
      itemurl: '',
      itemurls: [],
      label: '',
      manifests: [],
      tree: [],
    };
  },
  created() {
    this.getConfig();
    this.init();
    this.itemurls.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    this.$q.dark.set('auto');

    if (this.config.colors.primary && this.config.colors.secondary && this.config.colors.accent) {
      colors.setBrand('primary', this.config.colors.primary);
      colors.setBrand('secondary', this.config.colors.secondary);
      colors.setBrand('accent', this.config.colors.accent);
    }
  },
  mounted() {
    /**
      * listen to fontsize change (user interaction). emitted in @/components/content.vue
      * in- or rather decrease fontsize of the text by 1px
      * default fontsize: 14px
      *
      * @param number fontsize
      */
    this.$root.$on('update-fontsize', (fontsize) => {
      this.fontsize = fontsize;
    });
    this.$root.$on('panels-position', (newPanels) => {
      this.panels = newPanels;
    });
    /**
      * listen to item change (user interaction).
      * emitted in: *getItemurls*; handler for tree nodes. fired on user interaction
      *
      * @param string url
      */
    this.$root.$on('update-item', (url) => {
      this.itemurl = url;
      this.$router.push({ query: { itemurl: url } });
      // NOTE: Set imageurl to an empty string. Otherwise, if there is no corresponding image,
      // the "preceding" image according to the "preceding" item will be shown.
      this.imageurl = '';
      this.getItemData(url);
    });
  },
  methods: {
    /**
      * get resources using JavaScript's native fetch api
      * caller: *getCollection()*, *getItemData()*, *getManifest()*
      *         *@/components/content.vue::getSupport()*, *@/components/content.vue::created-hook*
      *
      * @param string url
      * @param string responsetype
      *
      * @return promise data
      */
    async request(url, responsetype = 'json') {
      const response = await fetch(url);
      const data = await (responsetype === 'text' ? response.text() : response.json());

      return data;
    },
    /**
      * get collection data according to 'entrypoint'
      * (number of requests equal the number of manifests contained within a collection)
      * initialize the tree's root node
      * caller: *init()*
      *
      * @param string url
      */
    getCollection(url) {
      this.isCollection = true;

      this.request(url)
        .then((data) => {
          this.collection = data;
          this.label = this.getLabel(data);

          this.tree.push(
            {
              children: [],
              handler: (node) => {
                this.$root.$emit('update-tree-knots', node.label);
              },
              label: this.label,
              'label-key': this.label,
              selectable: false,
            },
          );

          if (Array.isArray(data.sequence)) {
            data.sequence.forEach((seq) => this.getManifest(seq.id));
          }
        });
    },
    /**
      * get config object (JSON) from index.html
      * caller: *created-hook*
      */
    getConfig() {
      this.config = JSON.parse(document.getElementById('tido-config').text);

      if (!this.config.entrypoint) {
        setTimeout(() => {
          this.$q.notify({
            html: true,
            progress: true,
            type: 'secondary',
            message: 'NO ENTRYPOINT SET! ==> <a href="https://gitlab.gwdg.de/subugoe/emo/Qviewer/-/blob/main/README.md" target="_blank">README</a>',
          });
        }, 500);
      }
    },
    /**
      * fetch all data provided on 'item level'
      * caller: *mounted-hook*, *getManifest()*
      *
      * @param string url
      */
    getItemData(url) {
      this.request(url)
        .then((data) => {
          this.collectiontitle = data.title.title;
          this.contenturl = data.content;
          this.imageurl = data.image && data.image.id ? data.image.id : '';
          this.itemlabel = data.n ? data.n : 'No itemlabel :(';

          // note: the scholars didn't mark the item language yet, so atm the API provides them all.
          // since we know, we are dealing with the arabic part of the collection, we define the language to be arabic.
          const [language] = data['x-langString'] ? data['x-langString'].split(',') : data.lang;

          this.itemlanguage = language;
        });
    },
    /**
      * caller: *getItemUrls()*
      *
      * @param string nodelabel
      *
      * @return number idx
      */
    getItemIndex(nodelabel) {
      let idx = 0;
      this.itemurls.forEach((item, index) => {
        if (item === nodelabel) {
          idx = index;
        }
      });
      return idx;
    },
    /**
      * get all itemurls hosted by each manifest's sequence to populate the aprropriate tree node
      * caller: *getManifest()*
      *
      * @param array sequence
      * @param string label
      *
      * @return array urls
      */
    getItemUrls(sequence, label) {
      const urls = [];

      sequence.forEach((obj) => {
        const pagelabel = this.getPageLabel(obj.id);

        urls.push(
          {
            label: obj.id,
            'label-key': `${this.config.labels.item} ${pagelabel}`,
            handler: (node) => {
              if (this.itemurl === node.label) {
                return;
              }
              // node.label === itemurl
              // @param label === manifest label; passed by getManifest()
              this.$root.$emit('update-item', node.label, this.getSequenceIndex(label));
              this.$root.$emit('update-item-index', this.getItemIndex(node.label));
              this.$root.$emit('update-sequence-index', this.getSequenceIndex(label));
            },
          },
        );
      });
      return urls;
    },
    /**
      * get the collection label, if provided; otherwise get the manifest label
      * caller: *getCollection()*, *getManifest()*
      *
      * @param object data
      *
      * @return string 'label'
      */
    getLabel(data) {
      if (Object.keys(this.collection).length) {
        return data.title && data.title[0].title ? data.title[0].title : data.label;
      }
      return data.label ? data.label : 'Manifest <small>(No label available)</small>';
    },
    /**
      * get all the data provided on 'manifest level'
      * caller: *init()*, *getCollection()*
      *
      * @param string url
      */
    getManifest(url) {
      this.request(url)
        .then((data) => {
          // if the entrypoint points to a single manifest, initialize the tree
          if (this.isCollection === false) {
            this.tree.push({ label: '', 'label-key': this.config.labels.manifest, children: [] });
          }

          if (!Array.isArray(data.sequence)) {
            data.sequence = [data.sequence];
          }

          if (data.sequence[0] !== 'undefined') {
            data.sequence.map((seq) => this.itemurls.push(seq.id));
          }
          this.manifests.push(data);

          this.tree[0].children.push(
            {
              children: this.getItemUrls(data.sequence, data.label),
              label: data.label,
              'label-key': data.label,
              handler: (node) => {
                this.$root.$emit('update-tree-knots', node.label);
              },
              selectable: false,
            },
          );

          if (!this.label) {
            this.label = this.getLabel(data);
          }
          // make sure that urls are set just once on init
          if (!this.itemurl && data.sequence[0]) {
            this.itemurl = data.sequence[0].id;
            this.getItemData(data.sequence[0].id);
          }
        });
    },
    /**
      * extract the 'label part' of the itemurl
      * caller: *getItemUrls()*
      *
      * @param string itemurl
      *
      * @return string 'label part'
      */
    getPageLabel(itemurl) {
      return itemurl.replace(/.*-(.*)\/latest.*$/, '$1');
    },
    /**
      * caller: *getItemUrls()*
      *
      * @param string label
      *
      * @return number index
      */
    getSequenceIndex(label) {
      let index = 0;
      this.manifests.forEach((manifest, idx) => {
        if (manifest.label === label) {
          index = idx;
        }
      });
      return index;
    },
    /**
      * decide whether to start with a collection or a single manifest
      * caller: *created-hook*
      *
      * @return function getCollection() | getManifest()
      */
    init() {
      return this.config.entrypoint.match(/collection.json\s?$/)
        ? this.getCollection(this.config.entrypoint)
        : this.getManifest(this.config.entrypoint);
    },
  },

};
</script>
