<template>
  <q-layout
    id="q-app"
    class="root viewport"
    view="hHh Lpr fFf"
  >
    <Header
      v-if="config['header_section'].show"
      :collectiontitle="collectiontitle"
      :config="config"
      :default-view="defaultView"
      :imageurl="imageurl"
      :item="item"
      :itemurls="itemurls"
      :manifests="manifests"
      :panels="panels"
      :projectcolors="config.colors"
    />

    <q-page-container class="root">
      <router-view
        :annotations="annotations"
        :collection="collection"
        :config="config"
        :contentindex="contentindex"
        :contenttypes="contentTypes"
        :contenturls="contentUrls"
        :errormessage="errormessage"
        :error-image="errorImage"
        :error-text="errorText"
        :fontsize="fontsize"
        :imageurl="imageurl"
        :isloading="isLoading"
        :item="item"
        :labels="config.labels"
        :manifests="manifests"
        :oncontentindexchange="oncontentindexchange"
        :panels="panels"
        :request="request"
        :tree="tree"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import * as AnnotationUtils from '@/utils';
import { colors } from 'quasar';
import treestore from '@/stores/treestore.js';
import Header from '@/components/header.vue';
import Panels from '@/mixins/panels';
import { getAnnotationTabs } from '@/utils';

export default {
  name: 'TIDO',
  components: {
    Header,
  },
  mixins: [
    Panels,
  ],
  data() {
    return {
      collection: {},
      collectiontitle: '',
      config: {},
      contentindex: 0,
      contentTypes: [],
      contentUrls: [],
      errormessage: false,
      errorImage: null,
      errorText: null,
      imageurl: '',
      isCollection: false,
      isLoading: false,
      item: {},
      itemurl: '',
      itemurls: [],
      loaded: false,
      manifests: [],
      tree: [],
    };
  },
  computed: {
    fontsize() {
      return this.$store.getters['annotations/contentFontSize'];
    },
    annotations() {
      return this.$store.getters['annotations/annotations'];
    },
  },
  watch: {
    '$route.query': {
      handler: 'onItemUrlChange',
      immediate: true,
    },
    manifests: {
      handler: 'onItemUrlChange',
      immediate: false,
    },
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
    this.$i18n.locale = this.config.lang;
    this.$root.$on('panels-position', (newPanels) => {
      this.panels = newPanels;
    });
    /**
      * listen to item change (user interaction).
      * emitted in: *getItemurls*; handler for tree nodes. fired on user interaction
      *
      * @param string url
      */
  },
  methods: {
    defaultView() {
      this.loaded = false;
    },
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
      const data = await (responsetype === 'text'
        ? response.text()
        : response.json());

      return data;
    },

    /**
      * get annotations of the current item
      * caller: *getItemData()*
      * @param string url
      */
    async getAnnotations(url) {
      this.$store.dispatch('annotations/loadAnnotations');

      try {
        const annotations = await this.request(url);

        if (!annotations.annotationCollection.first) {
          this.$store.dispatch('annotations/annotationLoaded', []);
          return;
        }

        const current = await this.request(
          annotations.annotationCollection.first,
        );

        if (current.annotationPage.items.length) {
          this.$store.dispatch('annotations/annotationLoaded', current.annotationPage.items.map((x) => ({ ...x, targetId: AnnotationUtils.stripTargetId(x, true) })));
        } else {
          this.$store.dispatch('annotations/annotationLoaded', []);
        }
      } catch (err) {
        this.$store.dispatch('annotations/annotationLoaded', []);
      }
    },
    /**
      * get collection data according to 'entrypoint'
      * (number of requests equal the number of manifests contained within a collection)
      * initialize the tree's root node
      * caller: *init()*
      *
      * @param string url
      */
    async getCollection(url) {
      this.isCollection = true;

      const data = await this.request(url);

      this.collection = data;
      this.collectiontitle = this.getLabel(data);

      this.tree.push({
        children: [],
        handler: (node) => {
          this.$root.$emit('update-tree-knots', node.label);
        },
        label: this.collectiontitle,
        'label-key': this.collectiontitle,
        selectable: false,
      });

      if (Array.isArray(data.sequence)) {
        const promises = [];
        data.sequence.forEach((seq) => promises.push(this.getManifest(seq.id)));

        await Promise.all(promises);
      }
      if (this.manifests?.[0]?.sequence?.[0]?.id && !this.$route.query.itemurl) {
        this.loaded = false;
        this.$router.push({ query: { ...this.$route.query, itemurl: this.manifests?.[0]?.sequence?.[0]?.id } });
      }
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
    getContentUrls(content) {
      const contentTypes = [];

      if (Array.isArray(content) && content.length) {
        content.forEach((c) => {
          if (c.type.match(/(application\/xhtml\+xml|text\/html)/)) {
            contentTypes.push({
              label: c.type.split('type=')[1],
              priority: this.config?.textContent?.tabs.priority?.[c.type.split('type=')[1]] || 100,
              url: c.url,
            });
          }
        });
        contentTypes.sort((a, b) => a.priority - b.priority);

        this.contentTypes = contentTypes.map((x) => x.label);
      }
      return contentTypes.map((x) => x.url);
    },
    /**
      * fetch all data provided on 'item level'
      * caller: *mounted-hook*, *getManifest()*
      *
      * @param string url
      */

    async getContentsItemData(url) {
      try {
        const data = await this.request(url);

        this.item = data;

        const previousManifest = (this.contentUrls[0] || '').split('/').pop().split('-')[0];

        this.contentUrls = this.getContentUrls(data.content);

        const currentManifest = this.contentUrls[0].split('/').pop().split('-')[0];

        if (previousManifest !== currentManifest) {
          const tabs = getAnnotationTabs(this.config);
          this.$store.dispatch('annotations/updateActiveTab', tabs?.[0].key);
          this.$root.$emit('manifest-changed');
        }

        if (data.annotationCollection) {
          this.getAnnotations(data.annotationCollection);
        }
      } catch (err) {
        this.errorText = {
          messageKey: 'textErrorMessageNotExists',
        };
      }
    },

    async getImageItemData(url) {
      const data = await this.request(url);

      if (data.image) {
        this.imageurl = data.image.id;
        try {
          const response = await fetch(this.imageurl);
          if (response.status === 200 || response.status === 201) {
            this.errormessage = false;
            this.errorImage = null;
          } else {
            // for vpn error.
            this.errormessage = true;
            this.errorImage = {
              messageKey: 'imageErrorMessageVPN',
            };
          }
        } catch (err) {
          // for CORS error.
          this.errormessage = true;
          this.errorImage = {
            messageKey: 'imageErrorMessageVPN',
          };
        }
      } else {
        this.errormessage = true;
        this.errorImage = {
          messageKey: 'imageErrorMessageNotExists',
        };
      }
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
    getItemUrls(sequence) {
      const urls = [];

      sequence.forEach((item) => {
        const itemLabel = this.getItemLabel(item.id);

        urls.push({
          label: item.id,
          'label-key': `${itemLabel}`,
          labelSheet: true,
          handler: (node) => {
            if (this.itemurl === node.label) {
              return;
            }
            this.loaded = false;
            this.$router.push({
              query: { ...this.$route.query, itemurl: node.label },
            });
          },
        });
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
        return data.title && data.title[0].title
          ? data.title[0].title
          : data.label;
      }
      return data.label
        ? data.label
        : 'Manifest <small>(No label available)</small>';
    },
    /**
      * get all the data provided on 'manifest level'
      * caller: *init()*, *getCollection()*
      *
      * @param string url
      */
    async getManifest(url) {
      const data = await this.request(url);

      if (!Array.isArray(data.sequence)) {
        data.sequence = [data.sequence];
      }

      if (data.sequence[0] !== 'undefined') {
        data.sequence.map((seq) => this.itemurls.push(seq.id));
      }
      this.manifests.push(data);

      if (this.isCollection) {
        this.tree[0].children.push({
          children: this.getItemUrls(data.sequence, data.label),
          label: data.label,
          'label-key': data.label,
          handler: (node) => {
            this.$root.$emit('update-tree-knots', node.label);
          },
          selectable: false,
        });
      } else {
        this.tree.push(...this.getItemUrls(data.sequence, data.label));
      }

      if (this.manifests?.[0]?.sequence?.[0]?.id && !this.$route.query.itemurl) {
        this.loaded = false;
        this.$router.push({ query: { ...this.$route.query, itemurl: this.manifests?.[0]?.sequence?.[0]?.id } });
      }
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

    oncontentindexchange(index) {
      this.contentindex = index;
    },

    onItemUrlChange() {
      if (this.loaded) {
        return;
      }

      const { itemurl } = this.$route.query;

      if (!itemurl) {
        return;
      }

      this.itemurl = decodeURIComponent(itemurl);

      const item = this.manifests.find((manifest) => manifest.sequence.find((manifestItem) => manifestItem.id === this.itemurl));
      if (!item) {
        return;
      }

      const { label } = item;
      const seqIdx = this.getSequenceIndex(label);

      treestore.updateselectedtreeitem(this.itemurl);
      treestore.updatetreesequence(seqIdx);
      this.$root.$emit('update-item', this.itemurl, seqIdx);
      this.$root.$emit('update-item-index', this.getItemIndex(this.itemurl));
      this.$root.$emit('update-sequence-index', seqIdx);

      const treeDom = document.getElementById(this.itemurl);

      if (treeDom) {
        treeDom.scrollIntoView({ block: 'center' });
      }

      // NOTE: Set imageurl to an empty string. Otherwise, if there is no corresponding image,
      // the "preceding" image according to the "preceding" item will be shown.
      this.imageurl = '';

      this.getContentsItemData(this.itemurl);
      this.getImageItemData(this.itemurl);

      this.loaded = true;
    },
  },
};
</script>

<style scoped lang="scss">
.root {
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 16px;
  overflow: hidden;
}

.viewport {
  height: 100vh;
  @media (max-width: $breakpoint-sm-custom-md) {
    height: auto;
    overflow: scroll;
  }
}
</style>
