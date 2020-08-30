#!/bin/bash

certbot renew --manual --preferred-challenges=http --manual-auth-hook ./ssl_auth.sh --manual-cleanup-hook ./ssl_cleanup.sh --manual-public-ip-logging-ok
