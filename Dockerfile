FROM nginxinc/nginx-unprivileged

ARG UID=101
ARG GID=101

ARG UGID="${UID}:${GID}"

EXPOSE $PORT
STOPSIGNAL SIGTERM

USER root

RUN apt-get install nginx-module-njs
RUN rm /etc/nginx/conf.d/*

COPY conf.d /etc/nginx/conf.d
COPY module.d /etc/nginx/module.d
COPY target/http.js /etc/nginx/module.d
ADD nginx.conf /etc/nginx/
RUN touch /var/run/nginx.pid && \
    chown -R "${UGID}" /var/run/nginx.pid

CMD ["nginx"]

USER ${UID}
