FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
git unzip curl libzip-dev zip \
&& docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chmod +x /app/start.sh

CMD ["sh", "/app/start.sh"]
