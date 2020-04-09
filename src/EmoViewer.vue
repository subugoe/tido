<template>
  <div>
    <Infobar v-if="manifests.length"
      :collection="collection"
      :itemurl="itemurl"
      :manifests="manifests"
    />

    <div class="sub-viewer-1__nav">
      <Togglebar :status="status" />

      <Navbar :itemurls="itemurls" :manifests="manifests" />
    </div>

    <div style="overflow: hidden; position: relative;">
      <div v-if="status.treeview" style="float: left; width: 25%;">
        <Toolbar heading="Treeview" />
        <q-separator />

        <Treeview
          :depth="0"
          :itemurl="itemurl"
          :itemurls="itemurls"
          :label="label"
          :manifests="manifests"
          :tree="tree"
        />
      </div>

      <div v-if="status.text" style="float: left; width: 25%;">
        <Toolbar heading="Text" />
        <q-separator />

        <Content
          :key="itemurl"
          :itemurl="itemurl"
          :request="request"
        />
      </div>

      <div v-if="status.image && imageurl" style="float: left; width: 25%;">
        <Toolbar heading="Image" />
        <q-separator />

        <OpenSeadragon :key="imageurl" :imageurl="imageurl" />
      </div>

      <div v-if="status.metadata && manifests.length" style="float: left; width: 25%;">
        <Toolbar heading="Metadata" />
        <q-separator />

        <Metadata :collection="collection" :manifests="manifests" />
      </div>
    </div>
  </div>
</template>

<script>
import Content from '@/components/content.vue';
import Infobar from '@/components/infobar.vue';
import Metadata from '@/components/metadata.vue';
import Navbar from '@/components/navbar.vue';
import OpenSeadragon from '@/components/openseadragon.vue';
import Toolbar from '@/components/quasar-toolbar.vue';
import Togglebar from '@/components/togglebar.vue';
import Treeview from '@/components/treeview.vue';

export default {
  name: 'EmoViewer',
  components: {
    Content,
    Infobar,
    Metadata,
    Navbar,
    OpenSeadragon,
    Togglebar,
    Toolbar,
    Treeview,
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
      vectornames: [
        'angle-double-right--light',
        'angle-right--light',
        'arrow-alt-left--normal',
        'arrow-alt-right--normal',
        'caret-right--light',
        'check-circle--normal',
        'circle--normal',
        'expand-alt--light',
        'expand--light',
        'search-plus--light',
        'search-minus--light',
        'skip-back',
        'skip-forward',
        'undo--normal',
      ],
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

          data.sequence.map((seq) => this.getManifest(seq.id));
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

          data.sequence.map((seq) => this.itemurls.push(seq.id));
          // make sure that urls are set just once on init
          if (!this.itemurl) {
            this.itemurl = data.sequence[0].id;
            this.getImageUrl(this.itemurl);
          }
          if (!this.label) {
            this.label = this.getLabel(data);
          }
        });
    },
    getVectors() {
      const path = 'statics/icons/';

      this.vectornames.forEach((svg) => {
        this.request(`${path}${svg}.svg`, 'text')
          .then((data) => {
            this.vectors[svg.replace(/(.*)--(light|normal)$/, '$1')] = data;
          });
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
