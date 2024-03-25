export function throwErrorObject(title, message) {
  const errorObjekt = {};
  errorObjekt.title = title;
  errorObjekt.message = message;
  throw errorObjekt;
}
