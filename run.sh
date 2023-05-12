#!/bin/bash
cd "$(dirname "$0")";
npm start >> log/report_$(date +'%F').log;