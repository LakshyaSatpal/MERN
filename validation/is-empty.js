const isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && Object.keys(val).length === 0) ||
  // Object.keys() returns an array with all keys
  (typeof val === "string" && val.trim().length === 0);

module.exports = isEmpty;
