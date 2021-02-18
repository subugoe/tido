const metadataSpecs = [
  {
    collection: {
      displayable: [
        'title',
        'collector',
        'description',
      ],
      mandatory: [
        'title',
        'collector',
      ],
    },
  },
  {
    manifest: {
      displayable: [
        'label',
        'actor',
        'actor:role',
        'actor:name',
        'actor:idref',
        'repository',
        'repository:label',
        'repository:url',
        'image',
        'image:license',
        'metadata',
        'metadata:key',
        'metadata:value',
        'license',
        'license:id',
        'license:notes',
        'description',
      ],
      mandatory: [
        'label',
        'actor',
        'actor:name',
        'metadata',
        'metadata:key',
        'metadata:value',
        'repository:url',
        'image:license',
        'license',
        'license:id',
      ],
    },
  },
  {
    item: {
      displayable: [
        'title',
        'title:title',
        'type',
        'n',
        'lang',
        'langAlt',
        'description',
        'idref',
        'idref:type',
        'idref:id',
      ],
      mandatory: [
        'title:title',
        'idref:type',
        'idref:id',
      ],
    },
  },
];

export { metadataSpecs };
