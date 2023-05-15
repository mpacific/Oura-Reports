import fs from 'fs';
import reportDates from './reportDates.js';

const reportMethods = {
  ouraDataFile: './data/ouraData.json',
  reportDataFile: './ui/lib/reportData.json',
  async getData() {
    return JSON.parse(fs.readFileSync(this.ouraDataFile));
  },
  // TODO
  // totalByDates(ouraData, key, startDate, endDate) {

  // },
  // averageByDates(ouraData, key, startDate, endDate) {

  // },
  organizeData(ouraData) {
    const dayData = reportDates.generateDays(ouraData);
    const weekData = reportDates.generateWeeks(ouraData);
    const monthData = reportDates.generateMonths(ouraData);

    const organizedData = {
      activity: {
        walkingDistance: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
        restingTime: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
        sedentaryTime: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
        activeCalories: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
        score: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
      },
      readiness: {
        score: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
      },
      sleep: {
        efficiency: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
        restfulness: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
        totalSleep: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
        score: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
        },
      },
    };

    return organizedData;
  },
  async writeData(data) {
    fs.writeFileSync(this.reportDataFile, JSON.stringify(data));
  },
};

export default async function generateReports() {
  const ouraData = await reportMethods.getData();
  const organizedData = reportMethods.organizeData(ouraData);
  await reportMethods.writeData(organizedData);
}
