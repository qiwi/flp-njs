#!/bin/bash
set -e

for template in $NGINX_DIR/**/*.conf.template $NGINX_DIR/*.conf.template; do
    output=${template%.template}

    envsubst '$PORT $APP_DIR $LOGS_DIR $ENVIRONMENT_PROFILE_NAME $NGINX_MODULE $ENVIRONMENT_PRODUCTS_NAME $DATACENTER' < $template > $output
    echo "$template -> $output"

    rm $template
done

# run nginx
nginx
