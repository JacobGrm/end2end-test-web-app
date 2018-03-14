#!/bin/sh

pm api https://bckquq.run.aws-usw02-pr.ice.predix.io
pm auth jacob@ge.com Test123
npm run build
pm publish
pm define
