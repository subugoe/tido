<template>
  <div id="q-app">
    <q-layout view="hHh lpr fff">
      <Header
        :collection="collection"
        :itemurl="itemurl"
        :itemurls="itemurls"
        :manifests="manifests"
        :status="status"
      />

      <q-page-container>
        <router-view
          :collection="collection"
          :imageurl="imageurl"
          :itemurl="itemurl"
          :manifests="manifests"
          :request="request"
          :tree="tree"
        />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import Header from '@/components/quasar-header.vue';

export default {
  name: 'Viewer',
  components: {
    Header,
  },
  data() {
    return {
      collection: {},
      config: {},
      imageurl: '',
      itemurl: '',
      itemurls: [],
      label: '',
      manifests: [],
      status: {
        image: true, text: true, metadata: true, treeview: true,
      },
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
    },
    getImageUrl(url) {
      this.request(url)
        .then((data) => {
          this.imageurl = data.image && data.image.id ? data.image.id : '';
        });
    },
    getItemContent(itemurl) {
      const itemcontent = {};

      this.request(itemurl)
        .then((data) => {
          itemcontent.collectiontitle = data.title ? data.title : 'No Title provided';
          itemcontent.contenturl = data.content;
          itemcontent.imageurl = data.image && data.image.id ? data.image.id : '';
          itemcontent.itemlanguage = data.language;
          itemcontent.pagenumber = data.n ? data.n : 'No pagenumber provided';
        });
      return itemcontent;
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
            labelKey: ctr += 1,
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
            this.getImageUrl(data.sequence[0].id);
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
      this.getImageUrl(url);
    });

    this.$root.$on('update-panel-status', (status) => {
      this.status = status;
    });
  },
};
</script>
