import fs from 'fs';
import _ from 'lodash';
import { DateTime } from 'luxon';
import reportDates from './reportDates.js';

const reportMethods = {
  ouraDataFile: './data/ouraData.json',
  reportHtmlTemplate: './ui/indexTemplate.html',
  reportHtml: './ui/index.html',
  async getData() {
    return JSON.parse(fs.readFileSync(this.ouraDataFile));
  },
  totalByDates(ouraTypeData, key, startDate, endDate) {
    let total = 0;

    ouraTypeData.forEach((data) => {
      const dataMillis = DateTime.fromISO(data.timestamp).toMillis();
      if (dataMillis >= startDate.toMillis() && dataMillis <= endDate.toMillis() && _.get(data, key)) {
        total += _.get(data, key);
      }
    });

    return total;
  },
  averageByDates(ouraTypeData, key, startDate, endDate) {
    let total = 0;
    let count = 0;

    ouraTypeData.forEach((data) => {
      const dataTime = DateTime.fromISO(data.day);
      const dataMillis = dataTime.toMillis();
      if (dataMillis >= startDate.toMillis() && dataMillis <= endDate.toMillis() && _.get(data, key)) {
        total += _.get(data, key);
        count += 1;
      }
    });

    return total / count;
  },
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
          key: 'equivalent_walking_distance',
          type: 'total',
        },
        restingTime: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'resting_time',
          type: 'total',
        },
        sedentaryTime: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'sedentary_time',
          type: 'total',
        },
        activeCalories: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'active_calories',
          type: 'total',
        },
        score: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'score',
          type: 'average',
        },
      },
      readiness: {
        score: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'score',
          type: 'average',
        },
      },
      sleep: {
        efficiency: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'contributors.efficiency',
          type: 'average',
        },
        restfulness: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'contributors.restfulness',
          type: 'average',
        },
        totalSleep: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'contributors.total_sleep',
          type: 'average',
        },
        score: {
          daily: [].concat(dayData),
          weekly: [].concat(weekData),
          monthly: [].concat(monthData),
          key: 'score',
          type: 'average',
        },
      },
    };

    Object.keys(organizedData).forEach((metricType) => {
      Object.keys(organizedData[metricType]).forEach((metricSubtype) => {
        const dataToOrganize = organizedData[metricType][metricSubtype];
        ['daily', 'weekly', 'monthly'].forEach((timePeriod) => {
          dataToOrganize[timePeriod] = dataToOrganize[timePeriod].map((dateObject) => {
            const returnObject = { ...dateObject };
            returnObject.value = this[dataToOrganize.type === 'average' ? 'averageByDates' : 'totalByDates'](ouraData[metricType], dataToOrganize.key, dateObject.startDate, dateObject.endDate, metricType);
            return returnObject;
          });
        });
      });
    });

    return organizedData;
  },
  async writeData(data) {
    const indexFile = fs.readFileSync(this.reportHtmlTemplate).toString();
    const scriptRegex = /<script id="jsonData">(.*?)<\/script>/;
    const match = indexFile.match(scriptRegex);

    fs.writeFileSync(this.reportHtml, indexFile.replace(match?.[0], `<script id="jsonData">const jsonData = ${JSON.stringify(data)};</script>`));
  },
};

export default async function generateReports() {
  const ouraData = await reportMethods.getData();
  const organizedData = reportMethods.organizeData(ouraData);
  await reportMethods.writeData(organizedData);
}
