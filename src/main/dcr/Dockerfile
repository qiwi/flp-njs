FROM nginxinc/nginx-unprivileged

ENV APP_DIR=/opt/app \
    PORT=8080 \
    SVC_PORT=8081 \
    NGINX_DIR=/etc/nginx

ENV NGINX_TEMPLATE="${NGINX_DIR}/conf.d/nginx.template" \
    NGINX_MODULE="${NGINX_DIR}/module.d"

# https://github.com/nginxinc/docker-nginx-unprivileged/blob/main/Dockerfile-debian.template#L10
ARG UID=101
ARG GID=101
ARG UGID="${UID}:${GID}"

WORKDIR $APP_DIR
EXPOSE $PORT
EXPOSE $SVC_PORT
STOPSIGNAL SIGTERM

USER root

RUN apt-get install nginx-module-njs
COPY --chown="${UGID}" ./src/main/dcr/boot.sh /opt/scripts/
COPY --chown="${UGID}" ./target/nginx/ ${NGINX_DIR}/
COPY --chown="${UGID}" ./target/njs/ ${APP_DIR}/
COPY --chown="${UGID}" ./target/buildstamp.json ${APP_DIR}/

RUN mkdir -p /var/cache/nginx && chown -R "${UGID}" /var/cache/nginx && \
    mkdir -p /var/log/nginx && chown -R "${UGID}" /var/log/nginx && \
    chmod +x /opt/scripts/boot.sh

RUN touch /var/run/nginx.pid && \
    chown -R "${UGID}" /var/run/nginx.pid

CMD ["/opt/scripts/boot.sh"]

USER ${UID}
