import {
  biPersonFill,
  biGeoAltFill,
  biChatFill,
  biBoxArrowUpRight,
  biPenFill,
  biPencilSquare,
  biBank2,
  biArchiveFill,
  biCalendarWeek, biJournals,
} from '@quasar/extras/bootstrap-icons';

const icons = {
  biPersonFill,
  biGeoAltFill,
  biChatFill,
  biBoxArrowUpRight,
  biPenFill,
  biPencilSquare,
  biBank2,
  biArchiveFill,
  biCalendarWeek,
  biJournals,
};

export const icon = (name) => icons[name] || biPencilSquare;
