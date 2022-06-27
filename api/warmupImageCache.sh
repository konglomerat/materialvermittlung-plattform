#!/bin/sh
set -e

if [ "$(whoami)" = "root" ]; then
  echo "switching user from $(whoami) to www-data"
  su www-data -s /bin/sh -c "$0"
else
  echo "running as user $(whoami)"
  echo "warming up ..."

  for file in ./public/media/*
  do
    if file "$file" |grep -qE 'image|bitmap'; then
      php bin/console liip:imagine:cache:resolve "media/$(basename $file)"
    fi
  done

  echo "DONE warming up"
fi
