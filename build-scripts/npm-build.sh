#!/bin/bash
set -e -x

npm run clean 
mkdir -p dist 
npm run copy:spec 
npm run copy:jasmine 
npm run copy:scripts 
npm run copy:elements 
npm run copy:assets 
npm run copy:res
npm run build:html 
npm run vulcanize
