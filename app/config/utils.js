const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
};

module.exports = { convertTimeToMinutes };
