const defaultConfig = {
    globalTree: true,
    documents: {
        collections: [
            'https://api.dev.ahiqar.sub.uni-goettingen.de/textapi/ahiqar/syriac/collection.json',
            'https://api.dev.ahiqar.sub.uni-goettingen.de/textapi/ahiqar/syriac/collection.json',
        ],
        manifests: [
            'https://goethes-farbenlehre-berlin.sub.uni-goettingen.de/textapi/Z_1822-02-20_k/manifest.json',
        ],
    },
    urlConfig: {},
    config: {
        labels: {
            item: 'Sheet',
            manifest: 'Manuscript',
        },
        colors: {
            forceMode: 'light',
            primary: '#1a3771',
        },
        panels: [
            {
                label: 'contents_and_metadata',
                views: [
                    {
                        id: 'tree',
                        label: 'contents',
                        connector: {
                            id: 1,
                        },
                    },
                    {
                        id: 'metadata',
                        label: 'metadata',
                        connector: {
                            id: 2,
                            options: {
                                collection: {
                                    all: true,
                                },
                                manifest: {
                                    all: true,
                                },
                                item: {
                                    all: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                label: 'image',
                views: [
                    {
                        id: 'image',
                        label: 'Image',
                        connector: {
                            id: 3,
                        },
                    },
                ],
            },
            {
                label: 'text',
                views: [
                    {
                        id: 'text1',
                        label: 'Transcription',
                        default: true,
                        connector: {
                            id: 4,
                            options: {
                                type: 'transcription',
                            },
                        },
                    },
                    {
                        id: 'text2',
                        label: 'Transliteration',
                        connector: {
                            id: 4,
                            options: {
                                type: 'transliteration',
                            },
                        },
                    },
                ],
            },
        ],
    },
};

export default defaultConfig;
