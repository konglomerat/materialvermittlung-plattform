FROM api

COPY --from=client /usr/src/client/build /srv/client/public/
COPY entrypoint.sh /entrypoint.sh

ENV APP_ENV=prod
ENV SHELL_VERBOSITY=3

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["php-fpm"]

