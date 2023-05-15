import fs from 'fs';

const reportMethods = {
  ouraDataFile: './data/ouraData.json',
  reportDataFile: './ui/lib/reportData.json',
  async getData() {
    return JSON.parse(fs.readFileSync(this.ouraDataFile));
  },
  organizeData() {
    const organizedData = {
      activity: {
        walkingDistance: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        restingTime: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        sedentaryTime: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        activeCalories: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        score: {
          daily: [],
          weekly: [],
          monthly: [],
        },
      },
      readiness: {
        score: {
          daily: [],
          weekly: [],
          monthly: [],
        },
      },
      sleep: {
        efficiency: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        restfulness: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        totalSleep: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        score: {
          daily: [],
          weekly: [],
          monthly: [],
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
