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
        :imageurl="imageurl"
        :itemurl="itemurl"
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
      manifestlabels: [
        'Cod. Arab. 236 Copenhagen',
        'Cod. ARABE 3637',
        'Borg. Arab. 201',
        'Vat. Arab. 2054',
        'Vat. Arab. 74',
        'Sbath 25',
        'Or. 1292. The Arabic Text in Leiden.',
        'Mingana Arabic Christian 93',
        'Cod. Sach. 339',
        'Vat. Syriac 424',
        'Brit. Libr. Or. 9321',
        'Paris. ar. 3656',
        'Cambrigde Add 3497',
        'DFM 00614',
        'GCAA 00486',
      ],
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

          this.tree.push({ label: this.label, children: [] });

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
    getItemurls(sequence, label) {
      const urls = [];

      if (Array.isArray(sequence)) {
        sequence.forEach((obj) => {
          urls.push(
            {
              label: obj.id,
              handler: (node) => {
                if (this.itemurl !== node.label) {
                  this.$root.$emit('update-item', node.label);
                }

                let idx = 0;
                this.itemurls.forEach((item, index) => {
                  if (item === node.label) {
                    idx = index;
                  }
                });

                this.$root.$emit('update-item-index', idx);
                this.$root.$emit('update-metadata', label, this.manifestlabels);
                this.$root.$emit('update-sequence-index', label, this.manifestlabels);
              },
            },
          );
        });
      } else {
        urls.push({ label: sequence.id });
      }
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
          this.manifests.push(data);

          if (!this.label) {
            this.label = this.getLabel(data);
          }

          if (Array.isArray(data.sequence) && data.sequence[0] !== 'undefined') {
            data.sequence.map((seq) => this.itemurls.push(seq.id));
          }

          this.tree[0].children.push(
            { label: data.label, children: this.getItemurls(data.sequence, data.label) },
          );
          // make sure that urls are set just once on init
          if (!this.itemurl && data.sequence[0]) {
            this.itemurl = data.sequence[0].id;
            this.getImageUrl(this.itemurl);
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
