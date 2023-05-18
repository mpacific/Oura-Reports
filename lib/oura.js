import axios from 'axios';
import fs from 'fs';
import { DateTime } from 'luxon';

const ouraMethods = {
  dataFile: './data/ouraData.json',
  async sendRequest(endpoint, params) {
    if (!process.env.OURA_ACCESS_TOKEN) throw new Error('No access token found!');

    return axios.request({
      url: `https://api.ouraring.com/v2${endpoint}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${process.env.OURA_ACCESS_TOKEN}`,
      },
      params,
    });
  },
  async getActivityData(startDate) {
    const response = await this.sendRequest('/usercollection/daily_activity', { start_date: startDate, end_date: this.currentDate });

    return response?.data?.data;
  },
  async getReadinessData(startDate) {
    const response = await this.sendRequest('/usercollection/daily_readiness', { start_date: startDate, end_date: this.currentDate });

    return response?.data?.data;
  },
  async getSleepData(startDate) {
    const response = await this.sendRequest('/usercollection/daily_sleep', { start_date: startDate, end_date: this.currentDate });

    return response?.data?.data;
  },
  replaceAndPushData(sourceData, newData) {
    let returnData = sourceData;

    newData.forEach((data) => {
      const matchingKey = Object.keys(returnData).find((key) => {
        const item = returnData[key];
        return item.day === data.day;
      });
      if (matchingKey) {
        returnData = returnData.slice(0, matchingKey).concat(returnData.slice(matchingKey + 1));
      }
      returnData.push(data);
    });

    return returnData;
  },
  sortItems(itemA, itemB) {
    if (itemA.day > itemB.day) {
      return 1;
    }
    if (itemB.day > itemA.day) {
      return -1;
    }

    return 0;
  },
  organizeData(dataObject, activityData, readinessData, sleepData) {
    const returnObject = dataObject;

    returnObject.activity = this.replaceAndPushData(returnObject.activity, activityData);
    returnObject.readiness = this.replaceAndPushData(returnObject.readiness, readinessData);
    returnObject.sleep = this.replaceAndPushData(returnObject.sleep, sleepData);

    returnObject.activity.sort(this.sortItems);
    returnObject.readiness.sort(this.sortItems);
    returnObject.sleep.sort(this.sortItems);

    return returnObject;
  },
  async getData() {
    let data;
    this.currentDate = DateTime.local().toFormat('yyyy-MM-dd');
    let startDate = DateTime.local().minus({ days: process.env.LOOKBACK_DAYS || 3 }).toFormat('yyyy-MM-dd');

    if (fs.existsSync(this.dataFile)) {
      data = JSON.parse(fs.readFileSync(this.dataFile));
    }
    if (!data?.activity?.length || !data?.readiness?.length || !data?.sleep?.length) {
      data = {
        activity: data?.activity || [],
        readiness: data?.readiness || [],
        sleep: data?.sleep || [],
      };
      startDate = process.env.DEFAULT_BEGIN_DATE || startDate;
    }

    const [activityData, readinessData, sleepData] = await Promise.all([
      this.getActivityData(startDate),
      this.getReadinessData(startDate),
      this.getSleepData(startDate),
    ]);

    return this.organizeData(data, activityData, readinessData, sleepData);
  },
  async writeData(data) {
    fs.writeFileSync(this.dataFile, JSON.stringify(data));
  },
};

export default async function updateReportData() {
  const ouraData = await ouraMethods.getData();
  await ouraMethods.writeData(ouraData);
}
