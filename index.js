import dotenv from 'dotenv';
import pleaseUpgradeNode from 'please-upgrade-node';
import fs from 'fs';
import updateReportData from './lib/oura.js';
import generateReports from './lib/output.js';

dotenv.config();

const packageJSON = JSON.parse(fs.readFileSync('./package.json'));
pleaseUpgradeNode(packageJSON, {
  exitCode: 0,
});

(async () => {
  try {
    await updateReportData();
    await generateReports();
  } catch (error) {
    console.log(`Error during runtime: ${error}`);
    console.trace(error);
  }
})();
