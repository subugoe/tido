const textLabels = [
  {
    classes: 'catchwords',
    label: 'One or more catchwords.',
  },
  {
    classes: 'gap',
    label: 'Represents words between the breaking words.',
  },
  {
    classes: 'header',
    label: 'Represents title of the text.',
  },
  {
    classes: 'hi red',
    label: 'This is a rubrication.',
  },
  {
    classes: 'lg colophon',
    label: 'A colophon in verse.',
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
    classes: 'quote colophon',
    label: 'A colophon.',
  },
  {
    classes: 'ref',
    label: 'ref indicates text that references other text in some way.',
  },
  {
    classes: 'seg',
    label: 'Segments, part of a virtual collection that belongs together in some way.',
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
