<template>
  <q-layout view="hHh lpr fff">
    <Header
      :collection="collection"
      :itemurl="itemurl"
      :itemurls="itemurls"
      :manifests="manifests"
      :status="status"
    />

    <q-page-container>
      <MainView
        :collection="collection"
        :depth="0"
        :imageurl="imageurl"
        :itemurl="itemurl"
        :itemurls="itemurls"
        :label="label"
        :manifests="manifests"
        :request="request"
        :tree="tree"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import MainView from '@/views/quasar-mainview.vue';
import Header from '@/components/quasar-header.vue';

export default {
  name: 'EmoViewer',
  components: {
    MainView,
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

          if (Array.isArray(data.sequence)) {
            data.sequence.map((seq) => this.getManifest(seq.id));
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
    getLabel(data) {
      if (Object.keys(this.collection).length) {
        return data.title && data.title[0].title ? data.title[0].title : data.label;
      }
      return 'Manifest';
    },
    getManifest(url) {
      this.request(url)
        .then((data) => {
          this.manifests.push(data);
          this.tree.push({ label: data.label, nodes: data.sequence });

          if (Array.isArray(data.sequence) && data.sequence[0] !== 'undefined') {
            data.sequence.map((seq) => this.itemurls.push(seq.id));
          }
          // make sure that urls are set just once on init
          if (!this.itemurl && data.sequence[0] !== 'undefined') {
            this.itemurl = data.sequence[0].id;
            this.getImageUrl(this.itemurl);
          }
          if (!this.label) {
            this.label = this.getLabel(data);
          }
        });
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
