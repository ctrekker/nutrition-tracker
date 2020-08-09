#!/usr/bin/env bash

vim src/Config.js
npm run build
rm build/static/js/*.map
rm build/static/css/*.map
