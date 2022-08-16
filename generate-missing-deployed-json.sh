#!/usr/bin/env bash

FILE=src/config/deployed.json
if [[ -f "$FILE" ]]; then
    echo "deployed.json exists."
else
    echo "{}" > $FILE
fi
