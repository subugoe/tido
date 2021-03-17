const textLabels = [
  {
    classes: 'abbr',
    label: 'This indicates an abbrevation.',
  },
  {
    classes: 'add above',
    label: 'To set apart from the running text visually.',
  },
  {
    classes: 'catchwords',
    label: 'To set apart from the running text and de-emphasized.',
  },
  {
    classes: 'damage',
    label: 'This is a damage text.',
  },
  {
    classes: 'expan',
    label: 'This represents the expanded version of an abbreviation.',
  },
  {
    classes: 'g',
    label: 'Only the text of tei:g is rendered.',
  },
  {
    classes: 'gap',
    label: 'Represents words between the breaking words.',
  },
  {
    classes: 'hi red',
    label: 'This is a text.',
  },
  {
    classes: 'note',
    label: 'Information encoded in note have added text to the manuscript.',
  },
  {
    classes: 'orig',
    label: 'Displays a text node.',
  },
  {
    classes: 'ref',
    label: 'ref indicates text that references other text in some way.',
  },
  {
    classes: 'seg',
    label: 'Segments, part of a virtual collection that belongs together in some way.',
  },
  {
    classes: 'sic',
    label: 'sic marks text that obviously has errors; usually it is corrected be editor.',
  },
  {
    classes: 'persName',
    label: 'This is a person name.',
  },
  {
    classes: 'placeName',
    label: 'Represents a place name.',
  },
  {
    classes: 'quote colophon',
    label: 'A colophon.',
  },
  {
    classes: 'lg colophon',
    label: 'A colophon in verse.',
  },
];

const textStyles = textLabels.map((t) => t.classes);

export const getClasses = (html) => {
  const res = {};

  textStyles.forEach((className) => {
    res[className] = html.includes(`class="${className}"`);
  });

  return res;
};

export default textLabels;
