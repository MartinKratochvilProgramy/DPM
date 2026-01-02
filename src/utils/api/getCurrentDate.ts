export const getCurrentDate = (): string => {
  // returns current date in format yyyy-mm-dd
  const currentDate = new Date();
  const today = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  return today;
};
