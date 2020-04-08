<template>
  <div>
    <Infobar v-if="manifests.length"
      :collection="collection"
      :itemurl="itemurl"
      :manifests="manifests"
      :vectors="vectors"
      >
    </Infobar>

    <div class="sub-viewer-1__nav">
      <Togglebar
        :status="status"
        :vectors="vectors"
        >
      </Togglebar>

      <Navbar
        :itemurls="itemurls"
        :manifests="manifests"
        :vectors="vectors"
        >
      </Navbar>
    </div>
    <div style="overflow: hidden; position: relative;">
      <Treeview v-if="status.treeview"
        style="float: left; width: 25%;"
        :depth="0"
        :itemurl="itemurl"
        :itemurls="itemurls"
        :label="label"
        :manifests="manifests"
        :tree="tree"
        :vectors="vectors"
        >
      </Treeview>

      <Content v-if="status.text"
        style="float: left; width: 25%;"
        :key="itemurl"
        :itemurl="itemurl"
        :request="request"
        >
      </Content>

      <OpenSeadragon v-if="status.image && imageurl"
        style="float: left; width: 25%;"
        :key="imageurl"
        :imageurl="imageurl"
        :vectors="vectors"
        >
      </OpenSeadragon>

      <Metadata v-if="status.metadata && manifests.length"
        style="float: left; width: 25%;"
        :collection="collection"
        :manifests="manifests"
        >
      </Metadata>
    </div>
  </div>
</template>

<script>
import Infobar from '@/components/infobar.vue';
import Navbar from '@/components/navbar.vue';
import Togglebar from '@/components/togglebar.vue';
import Content from '@/components/content.vue';
import Metadata from '@/components/metadata.vue';
import OpenSeadragon from '@/components/openseadragon.vue';
import Treeview from '@/components/treeview.vue';

export default {
  name: 'EmoViewer',
  components: {
    Infobar,
    Navbar,
    Togglebar,
    Content,
    Metadata,
    OpenSeadragon,
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
      vectors: {},
    };
  },
  methods: {
    async request(url, responsetype = 'json') {
      const response = await fetch(url);
      const data = await (responsetype === 'text' ? response.text() : response.json());

      return data;
    },
    // Keycodes: 69 ==== 'e' 77 === 'm' 79 === 'o'
    // Type 'emo' (without quotes) to toggle the NavBar!
    extendNavigation() {
      let code = '';

      window.addEventListener('keyup', (event) => {
        code += event.keyCode;

        if (code.length > 6) {
          code = '';
        }
        if (code === '697779') {
          code = '';
          this.extended = !this.extended;
        }
      });
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
      const path = 'assets/icons/';

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
    this.getVectors();

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
