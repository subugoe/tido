<template>
  <div id="q-app">
    <q-layout view="hHh lpr fFf">
      <Header
        :collectiontitle="collectiontitle"
        :config="config"
        :itemurls="itemurls"
        :manifests="manifests"
        :pagelabel="pagelabel"
        :status="status"
      />

      <q-page-container>
        <router-view
          :collection="collection"
          :config="config"
          :contenturl="contenturl"
          :fontsize="fontsize"
          :imageurl="imageurl"
          :language="itemlanguage"
          :manifests="manifests"
          :pagelabel="pagelabel"
          :request="request"
          :status="status"
          :tree="tree"
        />
      </q-page-container>

      <Footer
        :standalone="config.standalone"
      />
    </q-layout>
  </div>
</template>

<script>
import Header from '@/components/quasar-header.vue';
import Footer from '@/components/quasar-footer.vue';

export default {
  name: 'Viewer',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      collection: {},
      collectiontitle: '',
      contenturl: '',
      config: {},
      fontsize: 14,
      imageurl: '',
      itemlanguage: '',
      itemurl: '',
      itemurls: [],
      label: '',
      pagelabel: '',
      manifests: [],
      status: {},
      tree: [],
    };
  },
  methods: {
    async request(url, responsetype = 'json') {
      const response = await fetch(url);
      const data = await (responsetype === 'text' ? response.text() : response.json());

      return data;
    },
    getCollection(url) {
      this.request(url)
        .then((data) => {
          this.collection = data;
          this.label = this.getLabel(data);

          this.tree.push({ label: this.label, labelKey: this.label, children: [] });

          if (Array.isArray(data.sequence)) {
            data.sequence.forEach((seq) => this.getManifest(seq.id));
          }
        });
    },
    getConfig() {
      this.config = JSON.parse(document.getElementById('emo-config').text);

      if (Object.keys(this.config.panels).length) {
        this.status = this.config.panels;
      }
    },
    getItemData(url) {
      this.request(url)
        .then((data) => {
          this.collectiontitle = data.title;
          this.contenturl = data.content;
          this.imageurl = data.image && data.image.id ? data.image.id : '';
          this.itemlanguage = data.language;
          this.pagelabel = data.n ? data.n : 'No pagelabel :(';
        });
    },
    getItemIndex(nodelabel) {
      let idx = 0;
      this.itemurls.forEach((item, index) => {
        if (item === nodelabel) {
          idx = index;
        }
      });
      return idx;
    },
    getItemUrls(sequence, label) {
      const urls = [];
      let ctr = 0;

      sequence.forEach((obj) => {
        urls.push(
          {
            label: obj.id,
            labelKey: `${this.config.itemlabel} ${ctr += 1}`,
            handler: (node) => {
              if (this.itemurl === node.label) {
                return;
              }
              this.$root.$emit('update-item', node.label);
              this.$root.$emit('update-item-index', this.getItemIndex(node.label));
              this.$root.$emit('update-sequence-index', this.getSequenceIndex(label));
            },
          },
        );
      });
      return urls;
    },
    getLabel(data) {
      if (Object.keys(this.collection).length) {
        return data.title && data.title[0].title ? data.title[0].title : data.label;
      }
      return data.label ? data.label : 'Manifest <small>(No label available)</small>';
    },
    getManifest(url) {
      this.request(url)
        .then((data) => {
          if (!Array.isArray(data.sequence)) {
            data.sequence = [data.sequence];
          }

          if (data.sequence[0] !== 'undefined') {
            data.sequence.map((seq) => this.itemurls.push(seq.id));
          }
          this.manifests.push(data);

          this.tree[0].children.push(
            {
              label: data.label,
              labelKey: data.label,
              children: this.getItemUrls(data.sequence, data.label),
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
    getSequenceIndex(label) {
      let index = 0;
      this.manifests.forEach((manifest, idx) => {
        if (manifest.label === label) {
          index = idx;
        }
      });
      return index;
    },
    init() {
      return this.config.entrypoint.match(/collection.json\s?$/)
        ? this.getCollection(this.config.entrypoint)
        : this.getManifest(this.config.entrypoint);
    },
  },
  created() {
    this.getConfig();
    this.init();

    this.itemurls.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  },
  mounted() {
    this.$root.$on('update-item', (url) => {
      this.itemurl = url;
      this.$router.push({ query: { itemurl: url } });
      // NOTE: Set imageurl to an empty string. Otherwise, if there is no corresponding image,
      // the "preceding" image according to the "preceding" itemurl will be shown.
      this.imageurl = '';
      this.getItemData(url);
    });

    this.$root.$on('update-panel-status', (status) => {
      this.status = status;
    });
    this.$root.$on('change-fontsize', (fontsize) => {
      this.fontsize = fontsize;
    });
  },
};
</script>
