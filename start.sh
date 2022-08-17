#!/usr/bin/env bash

pnpm i
pnpm build
if [[ ! -d "build0" ]]; then mkdir build0; fi
rsync -a build/ build0 --delete
pm2 serve build0 3200 --spa --name bcsample
pm2 save
