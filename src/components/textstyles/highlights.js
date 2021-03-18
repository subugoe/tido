const textLabels = [
  {
    classes: 'abbr',
    label: 'This indicates an abbrevation.',
  },
  {
    classes: 'add above',
    label: 'Text that has been added later.',
  },
  {
    classes: 'catchwords',
    label: 'One or more catchwords.',
  },
  {
    classes: 'damage',
    label: 'This is a damaged text.',
  },
  {
    classes: 'expan',
    label: 'This represents the expanded version of an abbreviation.',
  },
  {
    classes: 'gap',
    label: 'Represents words between the breaking words.',
  },
  {
    classes: 'hi red',
    label: 'This is a rubrication.',
  },
  {
    classes: 'note',
    label: 'Text or information added to the manuscript later by a person other than the scribe.',
  },
  {
    classes: 'orig',
    label: 'The text in its original (not normalized or corrected) appearance in the manuscript.',
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
    label: 'sic marks text that obviously has errors; usually it is corrected by the editor(s).',
  },
  {
    classes: 'persName',
    label: 'This is a person`s name.',
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
  const result = {};

  textStyles.forEach((className) => {
    result[className] = html.includes(`class="${className}"`);
  });

  return result;
};

export default textLabels;
