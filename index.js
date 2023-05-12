import dotenv from 'dotenv';
import pleaseUpgradeNode from 'please-upgrade-node';
import fs from 'fs';

dotenv.config();

const packageJSON = JSON.parse(fs.readFileSync('./package.json'));
pleaseUpgradeNode(packageJSON, {
  exitCode: 0,
});
