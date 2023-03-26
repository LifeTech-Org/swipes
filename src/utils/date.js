/**
 * @param {Date} date - The date
 * @param {string} myString - The string
 */

const getToday = () => {
  const date = new Date();
  date.setDate(date.getDate());
  return date.toLocaleDateString("en-CA");
};

const getPreviousDate = (date) => {
  const _date = new Date(date);
  _date.setDate(_date.getDate() - 1);
  return _date.toLocaleDateString("en-CA");
};

const getNextDate = (date) => {
  const _date = new Date(date);
  _date.setDate(_date.getDate() + 1);
  return _date.toLocaleDateString("en-CA");
};

export { getToday, getPreviousDate, getNextDate };
