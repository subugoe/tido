const textLabels = [
  {
    classes: 'header',
    label: 'Represents title of the text.',
  },
  {
    classes: 'catchwords',
    label: 'One or more catchwords.',
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
    classes: 'no_break',
    label: 'Describes that a word has begun in the line before and is continued'
    + 'in the current line.',
  },
  {
    classes: 'note',
    label: 'Text or information added to the manuscript later by a person other than the scribe.',
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
