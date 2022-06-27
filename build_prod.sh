#!/bin/sh
set -e

echo "Will build image with tag $1"

docker build --target materialvermittlung_php -t api api/
docker build --build-arg REACT_APP_API_ENTRYPOINT= --target materialvermittlung_client_nginx -t client client/

docker build -t $1 docker/prod
