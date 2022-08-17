#!/usr/bin/env bash

#git reset --hard
#git pull
#pnpm i
pnpm build
rsync -a build/ build0 --delete
pm2 restart bcsample
