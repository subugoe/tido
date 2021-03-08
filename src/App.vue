<template>
  <div id="q-app">
    <q-layout view="hHh lpr fFf">
      <Header
        v-if="config.headers.all"
        :collectiontitle="collectiontitle"
        :config="config"
        :item="item"
        :itemurls="itemurls"
        :manifests="manifests"
        :panels="panels"
      />

      <q-page-container>
        <router-view
          :annotationids="annotationids"
          :annotations="annotations"
          :collection="collection"
          :config="config"
          :contenturls="contenturls"
          :fontsize="fontsize"
          :imageurl="imageurl"
          :item="item"
          :labels="config.labels"
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
  name: 'TIDO',
  components: {
    Header,
    Footer,
  },
  mixins: [Panels],
  data() {
    return {
      annotationids: {},
      annotations: [],
      collection: {},
      collectiontitle: '',
      config: {},
      contenturls: [],
      fontsize: 14,
      imageurl: '',
      isCollection: false,
      item: {},
      itemurl: '',
      itemurls: [],
      manifests: [],
      tree: [],
    };
  },
  created() {
    this.getConfig();
    this.init();

    this.setColors();
    this.itemurls.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
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
      * get resources using JavaScript's native fetch API
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
      * get annotations of the current item
      * caller: *getItemData()*
      *
      * @param string url
      */
    getAnnotations(url) {
      this.request(url)
        .then((annotations) => {
          this.request(annotations.annotationCollection.first)
            .then((current) => {
              if (current.annotationPage.items && current.annotationPage.items.length) {
                this.annotations = current.annotationPage.items;
                this.annotationids = this.getAnnotationIds(this.annotations);
              }
            })
            .catch(() => {
              this.$q.notify({ message: 'No annotations available' });
            });
        });
    },
    /**
      * get annotation IDs of the current item
      * and extract the corresponding text part
      *
      * caller: *getAnnotations()*
      *
      * @param array annotations
      *
      * @return object target
      */
    getAnnotationIds(annotations) {
      const target = {};

      annotations.forEach((item) => {
        const split = item.target.id.split('/');
        const id = split[split.length - 1];

        const entity = document.getElementById(id);
        target[id] = { text: entity.innerText, comment: item.body.value, contenttype: item.body['x-content-type'] };
      });

      return target;
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
          this.collectiontitle = this.getLabel(data);

          this.initTree(this.collectiontitle);

          if (Array.isArray(data.sequence) && data.sequence.length) {
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
    },
    /**
      * filter all urls that match either of the MIME types "application/xhtml+xml" and "text/html"
      * caller: *getItemData()*
      *
      * @param string array
      *
      * @return array
      */
    getContentUrl(content) {
      const urls = [];

      if (Array.isArray(content) && content.length) {
        content.forEach((c) => {
          if (c.type.match(/(application\/xhtml\+xml|text\/html)/)) {
            urls.push(c.url);
          }
        });
      }
      return urls;
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
          this.item = data;

          this.contenturls = this.getContentUrl(data.content);
          this.imageurl = data.image.id || '';

          this.getAnnotations(data.annotationCollection);
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
      * extract the 'label part' of the itemurl
      * caller: *getItemUrls()*
      *
      * @param string itemurl
      *
      * @return string 'label part'
      */
    getItemLabel(itemurl) {
      return itemurl.replace(/.*-(.*)\/latest.*$/, '$1');
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

      sequence.forEach((item) => {
        const itemLabel = this.getItemLabel(item.id);

        urls.push(
          {
            label: item.id,
            'label-key': `${this.config.labels.item} ${itemLabel}`,
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
      if (this.isCollection) {
        return data.title[0].title || 'Collection';
      }
      return data.label || 'Manifest';
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
          if (!Array.isArray(data.sequence)) {
            data.sequence = [data.sequence];
          }
          this.manifests.push(data);

          // if manifest contains items push these onto the item pool (itemurls)
          if (data.sequence.length) {
            data.sequence.map((seq) => this.itemurls.push(seq.id));
          }

          // given a single manifest, initialize the tree
          if (!this.isCollection) {
            this.tree.push({ children: [], label: '', 'label-key': this.config.labels.manifest });
          }
          this.populateTree(data.sequence, data.label);

          // make sure that urls are set only once on init
          if (!this.itemurl && data.sequence[0].id) {
            this.itemurl = data.sequence[0].id;
            this.getItemData(data.sequence[0].id);
          }
        });
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
      * @return function getCollection() || getManifest()
      */
    init() {
      return this.config.entrypoint.match(/collection.json\s?$/)
        ? this.getCollection(this.config.entrypoint)
        : this.getManifest(this.config.entrypoint);
    },
    /**
      * initialize the tree node (collection only)
      * caller: *getCollection()*
      *
      * @param string cTitle
      */
    initTree(cTitle) {
      this.tree.push(
        {
          children: [],
          label: cTitle,
          'label-key': cTitle,
          selectable: false,
          handler: (node) => {
            this.$root.$emit('update-tree-knots', node.label);
          },
        },
      );
    },
    /**
      * caller: *getManifest()*
      *
      * @param array sequence
      * @param string mLabel
      */
    populateTree(sequence, mLabel) {
      this.tree[0].children.push(
        {
          children: this.getItemUrls(sequence, mLabel),
          label: mLabel,
          'label-key': mLabel,
          handler: (node) => {
            this.$root.$emit('update-tree-knots', node.label);
          },
          selectable: false,
        },
      );
    },
    setColors() {
      this.$q.dark.set('auto');
      // filter all colors that have been set (index.html)
      const colours = Object.entries(this.config.colors).filter((c) => c[1] !== '');

      // actually only set a brand, if ALL the colors are set
      if (Object.keys(this.config.colors).length === colours.length) {
        colours.forEach((color) => {
          colors.setBrand(color[0].toString(), this.config.colors[color[0]]);
        });
      }
    },
  },
};
</script>
