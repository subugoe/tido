const defaultConfig: Config = {
  globalTree: true,
  panels: [
    {
      entrypoint: {
        url: 'https://goethes-farbenlehre-berlin.sub.uni-goettingen.de/textapi/Z_1822-02-20_k/manifest.json',
        type: 'manifest'
      }
        
    },
    {
      entrypoint: {
        url: 'https://goethes-farbenlehre-berlin.sub.uni-goettingen.de/textapi/ Z_1829-06-28_k/manifest.json',
        type: 'manifest'
      } 
    }
  ],
}

export default defaultConfig
