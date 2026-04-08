#!/bin/sh
set -e

if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force
fi

php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
