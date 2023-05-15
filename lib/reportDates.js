export default {
  generateDays(ouraData) {
    const firstDay = ouraData.activity[0].timestamp;
    const lastDay = ouraData.activity[ouraData.activity.length - 1].timestamp;
    const firstDate = new Date(firstDay);
    const lastDate = new Date(lastDay);

    const days = [];

    let workingDate = new Date(firstDate);
    while (workingDate <= lastDate) {
      days.push({
        date: new Date(workingDate).toISOString().split('T')[0],
        startDate: workingDate,
        endDate: workingDate,
      });

      workingDate = new Date(workingDate);
      workingDate.setDate(workingDate.getDate() + 1);
    }

    return days;
  },
  generateWeeks(ouraData) {
    const firstDay = ouraData.activity[0].timestamp;
    const lastDay = ouraData.activity[ouraData.activity.length - 1].timestamp;
    const firstDate = new Date(firstDay);
    const lastDate = new Date(lastDay);
    lastDate.setDate(lastDate.getDate() + (6 - lastDate.getDay()));

    let startWorkingDate = new Date(firstDate.valueOf());
    startWorkingDate.setDate(startWorkingDate.getDate() - startWorkingDate.getDay());
    let endWorkingDate = new Date(startWorkingDate.valueOf());
    endWorkingDate.setDate(endWorkingDate.getDate() + 6);

    const weeks = [];

    while (endWorkingDate <= lastDate) {
      weeks.push({
        date: new Date(startWorkingDate).toISOString().split('T')[0],
        startDate: startWorkingDate,
        endDate: endWorkingDate,
      });

      startWorkingDate = new Date(startWorkingDate);
      endWorkingDate = new Date(endWorkingDate);
      startWorkingDate.setDate(startWorkingDate.getDate() + 7);
      endWorkingDate.setDate(endWorkingDate.getDate() + 7);
    }

    return weeks;
  },
  generateMonths(ouraData) {
    const firstDay = ouraData.activity[0].day;
    const lastDay = ouraData.activity[ouraData.activity.length - 1].day;
    const firstDate = new Date(firstDay);
    const lastDate = new Date(lastDay);

    let workingDate = new Date(firstDate.valueOf());
    workingDate.setDate(1);

    const months = [];

    while (workingDate <= lastDate) {
      months.push({
        date: new Date(workingDate).toISOString().split('T')[0],
        startDate: workingDate,
        endDate: new Date(new Date(new Date(workingDate).setMonth(workingDate.getMonth() + 1)).setDate(0)),
      });

      workingDate = new Date(new Date(workingDate).setMonth(workingDate.getMonth() + 1));
    }

    return months;
  },
};
