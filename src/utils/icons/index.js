import * as icons from './icons';

// eslint-disable-next-line import/namespace
export const getIcon = (name) => icons[name] || icons.pencil;
