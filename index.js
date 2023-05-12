import dotenv from 'dotenv';
import pleaseUpgradeNode from 'please-upgrade-node';
import fs from 'fs';
import updateReports from './lib/oura.js';

dotenv.config();

const packageJSON = JSON.parse(fs.readFileSync('./package.json'));
pleaseUpgradeNode(packageJSON, {
  exitCode: 0,
});

(async () => {
  try {
    await updateReports();
  } catch (error) {
    console.log(`Error during runtime: ${error}`);
    console.trace(error);
  }
})();
