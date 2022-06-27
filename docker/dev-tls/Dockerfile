# use this self-generated certificate only in dev, IT IS NOT SECURE!


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NGINX_VERSION=1.17


FROM nginx:${NGINX_VERSION}-alpine

# persistent / runtime deps
RUN apk add --no-cache \
		nss-tools \
	;

WORKDIR /certs

ARG MKCERT_VERSION=1.4.1
RUN set -eux; \
	wget -O /usr/local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/download/v$MKCERT_VERSION/mkcert-v$MKCERT_VERSION-linux-amd64; \
	chmod +x /usr/local/bin/mkcert; \
	mkcert --cert-file localhost.crt --key-file localhost.key localhost 127.0.0.1 ::1; \
	# the file must be named server.pem - the default certificate path in webpack-dev-server
	cat localhost.key localhost.crt > server.pem; \
	# export the root CA cert, but not the root CA key
	cp "$(mkcert -CAROOT)/rootCA.pem" /certs/localCA.crt

VOLUME /certs

# add redirect from http://localhost to https://localhost
RUN set -eux; \
	{ \
		echo 'server {'; \
		echo '    return 301 https://$host$request_uri;'; \
		echo '}'; \
		echo 'server {'; \
		echo '    client_max_body_size 20M;'; \
		echo '    listen 443 ssl http2;'; \
		echo '    ssl_certificate   /certs/localhost.crt;'; \
		echo '    ssl_certificate_key   /certs/localhost.key;'; \
		echo '    http2_push_preload on;'; \
		echo '    location / {'; \
		echo '        proxy_pass http://api:80;'; \
		echo '        proxy_read_timeout 24h;'; \
		echo '        proxy_http_version 1.1;'; \
		echo '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;'; \
		echo '        proxy_set_header X-Forwarded-Host $host;'; \
		echo '        proxy_set_header X-Forwarded-Proto $scheme;'; \
		echo '    }'; \
		echo '}'; \
	} | tee /etc/nginx/conf.d/default.conf
