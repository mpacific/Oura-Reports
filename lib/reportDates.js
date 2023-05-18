import { DateTime } from 'luxon';

export default {
  generateDays(ouraData) {
    const firstDay = ouraData.activity[0].timestamp;
    const firstDate = DateTime.fromISO(firstDay).startOf('day');
    const lastDate = DateTime.local();

    const days = [];

    let workingDate = firstDate;
    while (workingDate <= lastDate) {
      days.push({
        date: workingDate.toFormat('yyyy-MM-dd'),
        startDate: workingDate,
        endDate: workingDate.endOf('day'),
      });

      workingDate = workingDate.plus({ days: 1 });
    }

    return days;
  },
  generateWeeks(ouraData) {
    const firstDay = ouraData.activity[0].day;
    const firstDate = DateTime.fromISO(firstDay);
    const lastDate = DateTime.local();

    let workingDate = firstDate.startOf('week');

    const weeks = [];

    while (workingDate <= lastDate) {
      weeks.push({
        date: workingDate.toFormat('yyyy-MM-dd'),
        startDate: workingDate,
        endDate: workingDate.endOf('week'),
      });

      workingDate = workingDate.plus({ weeks: 1 });
    }

    return weeks;
  },
  generateMonths(ouraData) {
    const firstDay = ouraData.activity[0].day;
    const firstDate = DateTime.fromISO(firstDay);
    const lastDate = DateTime.local();

    let workingDate = firstDate.startOf('month');

    const months = [];

    while (workingDate <= lastDate) {
      months.push({
        date: workingDate.toFormat('yyyy-MM-dd'),
        startDate: workingDate,
        endDate: workingDate.endOf('month'),
      });

      workingDate = workingDate.plus({ months: 1 });
    }

    return months;
  },
};
