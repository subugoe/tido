const defaultConfig: Config = {
  globalTree: true,
  panels: [
    {
      collection:
        'https://api.ahiqar.sub.uni-goettingen.de/textapi/ahiqar/syriac/collection.json',
    },
    {
      manifest:
        'https://goethes-farbenlehre-berlin.sub.uni-goettingen.de/textapi/Z_1822-02-20_k/manifest.json',
    },
    {
      manifest:
        'https://goethes-farbenlehre-berlin.sub.uni-goettingen.de/textapi/ Z_1829-06-28_k/manifest.json',
    },
    {
      document: ''
    }
  ],
};

export default defaultConfig;
