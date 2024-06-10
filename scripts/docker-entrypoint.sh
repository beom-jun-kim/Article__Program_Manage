#!/bin/sh
node --max-old-space-size=${MAX_OLD_SPACE_SIZE:-2048} server.js
