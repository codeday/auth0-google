#!/usr/bin/env bash

mkdir /app/.secrets
if [[ -n $GOOGLE_KEY ]]; then
  echo "${GOOGLE_KEY}" > google.b64
  base64 -d google.b64 > /app/.secrets/google.json
  rm google.b64
fi
npm run start
