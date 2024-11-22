const defaultConfig = {
  globalTree: true,
  urlConfig: {},
  labels: {
    item: "Sheet",
    manifest: "Manuscript",
  },
  colors: {
    forceMode: "light",
    primary: "#1a3771",
  },
  panels: [
    {
      index: 0,
      manifest:
        "https://goethes-farbenlehre-berlin.sub.uni-goettingen.de/textapi/Z_1822-02-20_k/manifest.json",
    },
    {
      index: 1,
      manifest:
        "https://goethes-farbenlehre-berlin.sub.uni-goettingen.de/textapi/ Z_1829-06-28_k/manifest.json",
    },
  ],
};

export default defaultConfig;
