FROM wordpress:latest

RUN apt-get update \
    && apt-get install -y \
       libonig-dev \
       git \
    && docker-php-ext-install mbstring;

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
