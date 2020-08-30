#!/bin/bash

echo $CERTBOT_VALIDATION > ./backend/public/.well-known/acme-challenge/$CERTBOT_TOKEN
