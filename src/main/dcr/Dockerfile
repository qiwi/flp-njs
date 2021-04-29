FROM nginxinc/nginx-unprivileged

ENV APP_DIR=/opt/front-log-proxy \
    PORT=8080 \
    NGINX_DIR=/etc/nginx

ENV NGINX_TEMPLATE="${NGINX_DIR}/conf.d/nginx.template" \
    NGINX_MODULE="${NGINX_DIR}/module.d" \
    NGINX_MODULE_TEMPLATE="${NGINX_DIR}/module.d.template"

# https://github.com/nginxinc/docker-nginx-unprivileged/blob/main/Dockerfile-debian.template#L10
ARG UID=101
ARG GID=101
ARG UGID="${UID}:${GID}"

WORKDIR $APP_DIR
EXPOSE $PORT
STOPSIGNAL SIGTERM

USER root

COPY --chown="${UGID}" ./src/main/dcr/boot.sh /opt/scripts/
COPY --chown="${UGID}" ./target/nginx/ ${NGINX_DIR}/
COPY --chown="${UGID}" ./target/nginx/flp-app.d/ ${APP_DIR}/

RUN mkdir -p /var/cache/nginx && \
    mkdir -p /var/log/nginx && \
    mkdir -p /var/lib/nginx

RUN chown -R "${UGID}" "${APP_DIR}" && chmod -R 755 "${APP_DIR}" && \
    chown -R "${UGID}" /var/cache/nginx && \
    chown -R "${UGID}" /var/log/nginx && \
    chown -R "${UGID}" "${NGINX_DIR}" && \
    chown -R "${UGID}" "${NGINX_MODULE}" && chmod -R 755 "${NGINX_MODULE}" && \
    chown -R "${UGID}" /opt/scripts/boot.sh && chmod +x /opt/scripts/boot.sh

RUN touch /var/run/nginx.pid && \
    chown -R "${UGID}" /var/run/nginx.pid

CMD ["/opt/scripts/boot.sh"]

USER ${UID}
