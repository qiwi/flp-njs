#!/bin/bash
set -e

for template in $NGINX_MODULE/*.conf.template; do
    filename=${template##*/}
    filebase=${filename%.conf.template}

    envsubst '$PORT $APP_DIR $LOGS_DIR $ENVIRONMENT_PROFILE_NAME $NGINX_MODULE $ENVIRONMENT_PRODUCTS_NAME $DATACENTER' < $template > $NGINX_MODULE/$filebase.conf
done

nginx
